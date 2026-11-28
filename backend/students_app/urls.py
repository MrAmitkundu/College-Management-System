from django.urls import path
from . import views

urlpatterns = [
    # Student API
    path("student/", views.student_list, name="student-list"),
    path("departments/", views.department_list, name="department-list"),
    path("student/<str:student_id>/edit/", views.edit_student, name="student-edit"),
    path("student/<str:student_id>/promote/", views.promote_student, name="student-promote"),
    path("student/<str:student_id>/approve-fee/", views.approve_pending_fee, name="student-approve-fee"),
    path("student/<str:student_id>/revert-semester/", views.revert_semester, name="student-revert-semester"),

    # Faculty API
    path("faculty/", views.faculty_list, name="faculty-list"),

    # Examination API
    path("examination/", views.examination_list, name="examination-list"),

    # Notice API
    path("notice/", views.notice_list, name="notice-list"),
    path("notice/<int:notice_id>/", views.notice_detail, name="notice-detail"),

    # Dashboard Overview API
    path(
        "dashboard/overview/",
        views.dashboard_overview,
        name="dashboard-overview"
    ),
]