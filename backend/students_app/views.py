import re
from datetime import timedelta

from django.shortcuts import render, get_object_or_404
from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.utils import timezone

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


@api_view(["GET"])
def student_list(request):
    students = Student.objects.all().order_by("student_id")

    serializer = StudentSerializer(
        students,
        many=True
    )

    return Response(serializer.data)


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

    next_semester = _step_semester(student.semester, +1)

    Student.objects.filter(pk=student.pk).update(
        semester=next_semester,
        status="Pending Fee",
    )
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
    prev_semester = _step_semester(student.semester, -1)

    Student.objects.filter(pk=student.pk).update(
        semester=prev_semester,
        status="Active",
    )
    student.refresh_from_db()
    return Response(StudentSerializer(student).data, status=status.HTTP_200_OK)


@api_view(["GET"])
def faculty_list(request):
    faculty = Faculty.objects.all().order_by("faculty_id")

    serializer = FacultySerializer(
        faculty,
        many=True
    )

    return Response(serializer.data)


@api_view(["GET"])
def examination_list(request):
    examinations = Examination.objects.all().order_by("exam_id")

    serializer = ExaminationSerializer(
        examinations,
        many=True
    )

    return Response(serializer.data)


@api_view(["GET"])
def notice_list(request):
    notices = Notice.objects.all().order_by("notice_id")

    serializer = NoticeSerializer(
        notices,
        many=True
    )

    return Response(serializer.data)


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