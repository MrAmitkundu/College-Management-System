from django.urls import path
from . import views

urlpatterns = [
    path("student/", views.student_list, name="student-list"),


    path("faculty/", views.student_list, name="faculty-list"),

    path("examination/", views.student_list, name="exam-list"),

    path("Notice/", views.student_list, name="notice-list"),
]