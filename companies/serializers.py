from rest_framework import serializers

from .models import (Application, ApplicationStatusHistory, Company, Resume, InterviewRound, OADeadline, ApplicationNote, Tag)


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


class ResumeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resume
        fields = "__all__"
        read_only_fields = ["owner", "created_at", "updated_at"]

class InterviewRoundSerializer(serializers.ModelSerializer):

    class Meta:
        model = InterviewRound
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]

class OADeadlineSerializer(serializers.ModelSerializer):

    class Meta:
        model = OADeadline
        fields = "__all__"
        read_only_fields = [
            "owner",
            "created_at",
            "updated_at",
        ]

    def validate_application(self, application):
        request = self.context.get("request")

        if request and application.owner != request.user:
            raise serializers.ValidationError(
                "You can only add OA deadlines to your own applications."
            )

        return application


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"
        read_only_fields = [
            "owner",
            "created_at",
            "updated_at",
        ]

    def validate_applications(self, applications):
        request = self.context.get("request")

        if request:
            for application in applications:
                if application.owner != request.user:
                    raise serializers.ValidationError(
                        "You can only tag your own applications."
                    )

        return applications


class ApplicationNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationNote
        fields = "__all__"
        read_only_fields = [
            "owner",
            "created_at",
            "updated_at",
        ]

    def validate_application(self, application):
        request = self.context.get("request")

        if request and application.owner != request.user:
            raise serializers.ValidationError(
                "You can only add notes to your own applications."
            )

        return application
