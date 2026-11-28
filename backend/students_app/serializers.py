from django.core.cache import cache
from rest_framework import serializers
from .models import Student, Transaction, Faculty, Examination, Notice


def _promotion_cache_key(student_id):
    return f"student_promoted_from:{student_id}"


class StudentSerializer(serializers.ModelSerializer):
    can_revert = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = '__all__'
        # The API generates student_id and controls status. Semester is user-selectable.
        read_only_fields = ['student_id', 'status', 'can_revert']

    def get_can_revert(self, obj):
        is_pending = (obj.status or "").strip().lower() == "pending fee"
        if not is_pending:
            return False
        previous_semester = cache.get(_promotion_cache_key(obj.student_id))
        return bool(previous_semester)


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = '__all__'
        read_only_fields = ['faculty_id']


class ExaminationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examination
        fields = '__all__'


class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = '__all__'
        read_only_fields = ['notice_id', 'date']