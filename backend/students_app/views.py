import re
from datetime import datetime, timedelta

from django.shortcuts import render, get_object_or_404
from django.core.cache import cache
from django.db import transaction
from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.utils import timezone
from django.utils.dateparse import parse_date

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    Student,
    Transaction,
    Faculty,
    Examination,
    Notice,
)

from .serializers import (
    StudentSerializer,
    TransactionSerializer,
    FacultySerializer,
    ExaminationSerializer,
    NoticeSerializer,
    _promotion_cache_key,
)


def _format_ordinal(num):
    num = max(1, min(8, int(num)))
    if num == 1:
        return "1st"
    if num == 2:
        return "2nd"
    if num == 3:
        return "3rd"
    return f"{num}th"


def _step_semester(current_sem, delta):
    match = re.search(r"(\d+)", str(current_sem or ""))
    num = int(match.group(1)) if match else 0
    new_num = max(1, min(8, num + delta))
    return _format_ordinal(new_num)


def _generate_student_id():
    """Generate the next STU_NNN ID using the existing ID convention."""
    highest_number = 0
    for existing_id in Student.objects.values_list("student_id", flat=True):
        match = re.fullmatch(r"STU_(\d+)", str(existing_id or ""), re.IGNORECASE)
        if match:
            highest_number = max(highest_number, int(match.group(1)))

    candidate_number = highest_number + 1
    candidate = f"STU_{candidate_number:03d}"
    while Student.objects.filter(pk=candidate).exists():
        candidate_number += 1
        candidate = f"STU_{candidate_number:03d}"
    return candidate


@api_view(["GET", "POST"])
def student_list(request):
    if request.method == "GET":
        students = Student.objects.all().order_by("student_id")
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)

    serializer = StudentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # Never accept a client-provided ID or status. Every new student starts
    # with Pending Fee and cannot be reverted to a previous semester.
    with transaction.atomic():
        student = serializer.save(
            student_id=_generate_student_id(),
            status="Pending Fee",
        )
        cache.delete(_promotion_cache_key(student.student_id))

    return Response(StudentSerializer(student).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def department_list(request):
    """Return distinct department names from existing database records.

    The current project does not define a Department Django model, so this
    endpoint uses department fields already present in Student, Faculty, and
    Examination records.
    """
    names = set()
    for model in (Student, Faculty, Examination):
        names.update(
            model.objects.exclude(department__isnull=True)
            .exclude(department__exact="")
            .values_list("department", flat=True)
        )

    return Response(sorted(names, key=str.casefold))


@api_view(["PATCH", "PUT"])
def edit_student(request, student_id):
    student = get_object_or_404(Student, pk=student_id)
    data = {
        k: v for k, v in request.data.items()
        if k not in {"student_id", "semester", "status"}
    }
    if "date_of_birth" in data and data["date_of_birth"] == "":
        data["date_of_birth"] = None

    serializer = StudentSerializer(student, data=data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def promote_student(request, student_id):
    student = get_object_or_404(Student, pk=student_id)

    if (student.status or "").strip().lower() != "active":
        return Response(
            {"detail": "Only Active students can be promoted."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    current_match = re.search(r"(\d+)", str(student.semester or ""))
    current_num = int(current_match.group(1)) if current_match else 0
    if current_num >= 8:
        return Response(
            {"detail": "Student is already in the maximum semester (8th)."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    previous_semester = _format_ordinal(current_num)
    next_semester = _step_semester(student.semester, +1)

    Student.objects.filter(pk=student.pk).update(
        semester=next_semester,
        status="Pending Fee",
    )
    # Mark this student as eligible for rollback until their new semester fee is approved
    cache.set(_promotion_cache_key(student.student_id), previous_semester, timeout=None)

    student.refresh_from_db()
    return Response(StudentSerializer(student).data, status=status.HTTP_200_OK)


@api_view(["POST"])
def approve_pending_fee(request, student_id):
    student = get_object_or_404(Student, pk=student_id)
    txn_id = (request.data.get("transaction_id") or "").strip()

    if not txn_id:
        return Response(
            {"ok": False, "reason": "Transaction ID is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    txn = Transaction.objects.filter(transaction_id__iexact=txn_id).first()
    if not txn:
        return Response(
            {"ok": False, "reason": "Transaction ID not found."},
            status=status.HTTP_200_OK,
        )

    if (student.student_name or "").strip().lower() != (txn.student_name or "").strip().lower():
        return Response(
            {"ok": False, "reason": "Student name does not match the transaction record."},
            status=status.HTTP_200_OK,
        )

    today = timezone.localdate()
    cutoff = today - timedelta(days=30)
    if not txn.transaction_date or txn.transaction_date < cutoff or txn.transaction_date > today:
        return Response(
            {"ok": False, "reason": "Transaction date is not within the last 30 days."},
            status=status.HTTP_200_OK,
        )

    Student.objects.filter(pk=student.pk).update(status="Active")
    cache.delete(_promotion_cache_key(student.student_id))
    student.refresh_from_db()

    return Response(
        {
            "ok": True,
            "student": StudentSerializer(student).data,
            "transaction": TransactionSerializer(txn).data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def revert_semester(request, student_id):
    student = get_object_or_404(Student, pk=student_id)

    if (student.status or "").strip().lower() != "pending fee":
        return Response(
            {"detail": "Only students with Pending Fee status can be reverted."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    previous_semester = cache.get(_promotion_cache_key(student.student_id))
    if not previous_semester:
        return Response(
            {
                "detail": "Newly admitted students cannot be reverted to a previous semester."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    Student.objects.filter(pk=student.pk).update(
        semester=previous_semester,
        status="Active",
    )
    cache.delete(_promotion_cache_key(student.student_id))
    student.refresh_from_db()
    return Response(StudentSerializer(student).data, status=status.HTTP_200_OK)


def _generate_faculty_id():
    """Generate the next FAC_NNN ID while ignoring malformed legacy rows."""
    highest_number = 0
    for existing_id in Faculty.objects.values_list("faculty_id", flat=True):
        match = re.fullmatch(r"FAC[_-](\d+)", str(existing_id or ""), re.IGNORECASE)
        if match:
            highest_number = max(highest_number, int(match.group(1)))

    candidate_number = highest_number + 1
    candidate = f"FAC_{candidate_number:03d}"
    while Faculty.objects.filter(pk=candidate).exists():
        candidate_number += 1
        candidate = f"FAC_{candidate_number:03d}"
    return candidate


@api_view(["GET", "POST"])
def faculty_list(request):
    if request.method == "GET":
        faculty = Faculty.objects.all().order_by("faculty_id")
        serializer = FacultySerializer(faculty, many=True)
        return Response(serializer.data)

    # Translate the UI field names to the actual faculty table columns.
    data = {
        "teacher_name": (request.data.get("teacher_name") or request.data.get("name") or "").strip(),
        "department": (request.data.get("department") or request.data.get("dept") or "").strip(),
        "designation": (request.data.get("designation") or request.data.get("role") or "").strip(),
        "email": (request.data.get("email") or "").strip().lower(),
        "phone_number": (request.data.get("phone_number") or "").strip() or None,
    }

    serializer = FacultySerializer(data=data)
    serializer.is_valid(raise_exception=True)

    if data["email"] and Faculty.objects.filter(email__iexact=data["email"]).exists():
        return Response(
            {"email": ["A faculty member with this email address already exists."]},
            status=status.HTTP_400_BAD_REQUEST,
        )

    with transaction.atomic():
        faculty_member = serializer.save(faculty_id=_generate_faculty_id())
    return Response(
        FacultySerializer(faculty_member).data,
        status=status.HTTP_201_CREATED,
    )


def _department_exam_prefix(department):
    """Return the established subject-code prefix for a department."""
    known_prefixes = {
        "arts": "ART",
        "bba": "BBA",
        "bca": "BCA",
        "commerce": "COM",
        "computer science": "CS",
        "geography": "GEO",
        "mathematics": "MATH",
        "zoology": "ZOOG",
        "physics": "PHY",
        "electronics": "ECE",
        "mechanical": "MECH",
    }
    normalized = " ".join(str(department).strip().lower().split())
    if normalized in known_prefixes:
        return known_prefixes[normalized]

    # Fallback for departments not listed above: use their initials.
    words = re.findall(r"[A-Za-z0-9]+", str(department))
    prefix = "".join(word[0] for word in words).upper() or "EXAM"
    return prefix[:8]


def _generate_exam_id(department, semester):
    """Generate IDs in the existing format, e.g. CS_601, CS_602."""
    prefix = _department_exam_prefix(department)
    code_start = f"{prefix}_{semester}"
    highest_sequence = 0

    for existing_id in Examination.objects.filter(exam_id__startswith=code_start).values_list("exam_id", flat=True):
        match = re.fullmatch(rf"{re.escape(code_start)}(\d{{2,}})", str(existing_id or ""), re.IGNORECASE)
        if match:
            highest_sequence = max(highest_sequence, int(match.group(1)))

    sequence = highest_sequence + 1
    candidate = f"{code_start}{sequence:02d}"
    while Examination.objects.filter(pk=candidate).exists():
        sequence += 1
        candidate = f"{code_start}{sequence:02d}"
    return candidate


def _parse_exam_time(value):
    """Parse a time such as '10:00 AM' or '1:00 PM' from a slot label."""
    value = str(value or "").strip()
    for time_format in ("%I:%M %p", "%I %p", "%H:%M"):
        try:
            return datetime.strptime(value.upper(), time_format).time()
        except ValueError:
            continue
    return None


def _get_exam_status(exam_date, time_slot, now=None):
    """Calculate status from the exam date and its start/end clock times."""
    if not exam_date or not time_slot:
        return "Scheduled"

    # Current configured local timezone (Asia/Kolkata for this college app).
    current = now or timezone.localtime(timezone.now())
    parts = re.split(r"\s*(?:-|–|—)\s*", str(time_slot), maxsplit=1)
    if len(parts) != 2:
        return "Scheduled"

    start_time = _parse_exam_time(parts[0])
    end_time = _parse_exam_time(parts[1])
    if not start_time or not end_time:
        return "Scheduled"

    exam_start = timezone.make_aware(
        datetime.combine(exam_date, start_time),
        timezone.get_current_timezone(),
    )
    exam_end = timezone.make_aware(
        datetime.combine(exam_date, end_time),
        timezone.get_current_timezone(),
    )

    if current < exam_start:
        return "Scheduled"
    if current < exam_end:
        return "On Going"
    return "Exam Finished"


@api_view(["GET", "POST"])
def examination_list(request):
    if request.method == "GET":
        examinations = Examination.objects.all().order_by("exam_id")
        records = ExaminationSerializer(examinations, many=True).data
        # Status is calculated at request time; the MySQL table has no status column.
        for exam, record in zip(examinations, records):
            record["status"] = _get_exam_status(exam.date, exam.time_slot)
        return Response(records)

    # The UI's Subject Code maps to the existing examination.exam_id column.
    data = {
        "department": str(request.data.get("department") or request.data.get("dept") or "").strip(),
        "subject": str(request.data.get("subject") or "").strip(),
        "semester": request.data.get("semester"),
        "date": request.data.get("date"),
        "room": str(request.data.get("room") or "").strip(),
        "time_slot": str(request.data.get("time_slot") or request.data.get("time") or "").strip(),
    }

    required_fields = {
        "department": "Department is required.",
        "subject": "Subject name is required.",
        "semester": "Semester is required.",
        "date": "Exam date is required.",
        "room": "Room / hall is required.",
        "time_slot": "Time slot is required.",
    }
    errors = {
        field: [message]
        for field, message in required_fields.items()
        if data[field] in (None, "")
    }
    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        semester_number = int(data["semester"])
    except (TypeError, ValueError):
        semester_number = 0
    if semester_number < 1 or semester_number > 8:
        return Response(
            {"semester": ["Semester must be between 1 and 8."]},
            status=status.HTTP_400_BAD_REQUEST,
        )
    data["semester"] = semester_number

    exam_date = parse_date(str(data["date"]))
    if not exam_date:
        return Response(
            {"date": ["Enter a valid exam date in YYYY-MM-DD format."]},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if exam_date < timezone.localdate():
        return Response(
            {"date": ["Past exam dates are not allowed. Select today or a future date."]},
            status=status.HTTP_400_BAD_REQUEST,
        )

    slot_parts = re.split(r"\s*(?:-|–|—)\s*", data["time_slot"], maxsplit=1)
    if (len(slot_parts) != 2 or not _parse_exam_time(slot_parts[0])
            or not _parse_exam_time(slot_parts[1])):
        return Response(
            {"time_slot": ["Use a valid time range, for example 10:00 AM - 1:00 PM."]},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if _parse_exam_time(slot_parts[1]) <= _parse_exam_time(slot_parts[0]):
        return Response(
            {"time_slot": ["The exam end time must be later than its start time."]},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Subject codes are generated only on the server; ignore any client value.
    data["exam_id"] = _generate_exam_id(data["department"], semester_number)

    serializer = ExaminationSerializer(data=data)
    serializer.is_valid(raise_exception=True)

    with transaction.atomic():
        examination = serializer.save()

    response_data = ExaminationSerializer(examination).data
    response_data["status"] = _get_exam_status(examination.date, examination.time_slot)
    return Response(response_data, status=status.HTTP_201_CREATED)


def _generate_notice_id():
    """Generate the next integer primary key for unmanaged notice rows."""
    latest = Notice.objects.order_by("-notice_id").values_list("notice_id", flat=True).first()
    candidate = (latest or 0) + 1
    while Notice.objects.filter(pk=candidate).exists():
        candidate += 1
    return candidate


@api_view(["GET", "POST"])
def notice_list(request):
    if request.method == "GET":
        notices = Notice.objects.all().order_by("-date", "-notice_id")
        serializer = NoticeSerializer(notices, many=True)
        return Response(serializer.data)

    topic = str(
        request.data.get("notice_topic")
        or request.data.get("topic")
        or request.data.get("title")
        or ""
    ).strip()

    description = str(
        request.data.get("notice_description")
        or request.data.get("description")
        or request.data.get("text")
        or ""
    ).strip()

    raw_priority = str(request.data.get("priority") or "Low").strip().lower()
    priority_map = {
        "high": "High",
        "medium": "Medium",
        "low": "Low",
    }

    errors = {}
    if not topic:
        errors["notice_topic"] = ["Notice topic is required."]
    if not description:
        errors["notice_description"] = ["Notice description is required."]
    if raw_priority not in priority_map:
        errors["priority"] = ["Priority must be High, Medium, or Low."]

    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    data = {
        "notice_topic": topic,
        "notice_description": description,
        "priority": priority_map[raw_priority],
    }

    serializer = NoticeSerializer(data=data)
    serializer.is_valid(raise_exception=True)

    with transaction.atomic():
        notice = serializer.save(
            notice_id=_generate_notice_id(),
            date=timezone.localdate(),
        )

    return Response(NoticeSerializer(notice).data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
def notice_detail(request, notice_id):
    notice = get_object_or_404(Notice, pk=notice_id)
    notice.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ==========================================
# DASHBOARD OVERVIEW API
# ==========================================

@api_view(["GET"])
def dashboard_overview(request):

    # Real database counts
    total_students = Student.objects.count()

    total_faculty = Faculty.objects.count()

    # Transaction count will be connected after
    # adding your actual Transaction model.
    total_transactions = 0

    # The monthly graph requires the actual date
    # fields from your Student and Transaction models.
    monthly_data = []

    return Response({
        "total_students": total_students,
        "total_faculty": total_faculty,
        "total_transactions": total_transactions,
        "monthly_data": monthly_data,
    })