from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Student, Faculty
from .serializers import StudentSerializer, FacultySerializer


@api_view(["GET"])
def student_list(request):
    student = Student.objects.all().order_by("student_id")

    serializer = StudentSerializer(
        student,
        many=True
    )

    return Response(serializer.data)

