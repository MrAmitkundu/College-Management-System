from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Student,Faculty
from .serializers import StudentSerializer,FacultySerializer


@api_view(["GET"])
def student_list(request):
    student = Student.objects.all().order_by("student_id")

    serializer = StudentSerializer(
        student,
        many=True
    )

    return Response(serializer.data)


@api_view(["GET"])
def Faculty_list(request):
    faculty = faculty.objects.all().order_by("faculty_id")

    serializer = FacultySerializer(
        Faculty,
        many=True
    )

    return Response(serializer.data)



@api_view(["GET"])
def Examination_list(request):
    examination = examination.objects.all().order_by("exam_id")

    serializer = ExaminationSerializer(
        Examination,
        many=True
    )

    return Response(serializer.data)



@api_view(["GET"])
def Notice_list(request):
    notice = notice.objects.all().order_by("notice_id")

    serializer = NoticeSerializer(
        Notice,
        many=True
    )

    return Response(serializer.data)
