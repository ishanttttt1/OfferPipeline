from rest_framework import serializers

from .models import Application, ApplicationStatusHistory, Company


class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = "__all__"
        read_only_fields = ["owner", "created_at", "updated_at"]


class ApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        fields = "__all__"
        read_only_fields = ["owner", "created_at", "updated_at"]


class ApplicationStatusHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = ApplicationStatusHistory
        fields = ["status", "changed_at"]
        read_only_fields = ["status", "changed_at"]