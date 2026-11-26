from django.db import models

# Create your models here.
class Student(models.Model):
    student_id = models.CharField(primary_key=True, max_length=20)
    student_name = models.CharField(max_length=100)
    guardian_name = models.CharField(max_length=100, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    blood_group = models.CharField(max_length=5, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    semester = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'student'
