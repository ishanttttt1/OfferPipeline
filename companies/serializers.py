from rest_framework import serializers

from .models import Application,Company


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