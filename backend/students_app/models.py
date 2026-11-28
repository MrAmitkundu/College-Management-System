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
    status = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'student'


class Transaction(models.Model):
    transaction_id = models.CharField(primary_key=True, max_length=50)
    student_name = models.CharField(max_length=100)
    transaction_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'transaction'


class Faculty(models.Model):
    faculty_id = models.CharField(primary_key=True, max_length=20)
    teacher_name = models.CharField(max_length=100)
    department = models.CharField(max_length=100, blank=True, null=True)
    designation = models.CharField(max_length=50, blank=True, null=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'faculty'    



class Examination(models.Model):
    exam_id = models.CharField(primary_key=True, max_length=20)
    department = models.CharField(max_length=100, blank=True, null=True)
    subject = models.CharField(max_length=100, blank=True, null=True)
    semester = models.IntegerField(blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    room = models.CharField(max_length=50, blank=True, null=True)
    time_slot = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'examination' 



class Notice(models.Model):
    notice_id = models.IntegerField(primary_key=True)
    notice_topic = models.CharField(max_length=200, blank=True, null=True)
    notice_description = models.TextField(blank=True, null=True)
    priority = models.CharField(max_length=6, blank=True, null=True)
    date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notice'