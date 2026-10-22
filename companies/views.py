from django.db import transaction
from django.db.models import Q, Count

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import (
    Application,
    ApplicationStatusHistory,
    Company,
    Resume,
    InterviewRound,
    OADeadline,
    ApplicationNote,
    Tag,
)
from .serializers import (
    ApplicationSerializer,
    ApplicationStatusHistorySerializer,
    CompanySerializer,
    ResumeSerializer,
    InterviewRoundSerializer,
    OADeadlineSerializer,
    ApplicationNoteSerializer, 
    TagSerializer
)
from users.permissions import IsOwner

class AnalyticsViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user = request.user

        applications = Application.objects.filter(owner=user)
        oa_deadlines = OADeadline.objects.filter(
            owner=user,
            application__owner=user,
        )
        interview_rounds = InterviewRound.objects.filter(
            application__owner=user,
        )

        total_applications = applications.count()

        status_counts = applications.values("status").annotate(
            total=Count("id")
        )

        applications_by_status = {
            status: 0
            for status, _ in Application.STATUS_CHOICES
        }

        for item in status_counts:
            applications_by_status[item["status"]] = item["total"]

        total_oa_deadlines = oa_deadlines.count()
        completed_oa_deadlines = oa_deadlines.filter(
            status="completed"
        ).count()

        total_interview_rounds = interview_rounds.count()
        completed_interview_rounds = interview_rounds.filter(
            status="completed"
        ).count()

        responded_applications = applications.exclude(
            status="applied"
        ).count()

        return Response({
            "total_applications": total_applications,
            "offers": applications.filter(status="offer").count(),
            "rejections": applications.filter(status="rejected").count(),
            "applications_by_status": applications_by_status,
            "oa_completion_rate": (
                round(completed_oa_deadlines / total_oa_deadlines * 100, 2)
                if total_oa_deadlines
                else 0
            ),
            "interview_completion_rate": (
                round(
                    completed_interview_rounds
                    / total_interview_rounds
                    * 100,
                    2,
                )
                if total_interview_rounds
                else 0
            ),
            "response_rate": (
                round(responded_applications / total_applications * 100, 2)
                if total_applications
                else 0
            ),
        })
class ApplicationPagination(PageNumberPagination):
    page_size = 10


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Company.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    pagination_class = ApplicationPagination

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        queryset = Application.objects.filter(
        owner=self.request.user
            ).order_by("-created_at")

        status = self.request.query_params.get("status")

        if status:
            queryset = queryset.filter(status=status)

        company = self.request.query_params.get("company")

        if company:
            queryset = queryset.filter(
                company__name__icontains=company
            )

        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(
                Q(position__icontains=search)
                | Q(company__name__icontains=search)
            )

        return queryset

    @transaction.atomic
    def perform_create(self, serializer):
        application = serializer.save(owner=self.request.user)

        ApplicationStatusHistory.objects.create(
            application=application,
            status=application.status,
        )

    @transaction.atomic
    def perform_update(self, serializer):
        application = self.get_object()
        old_status = application.status

        application = serializer.save()

        if old_status != application.status:
            ApplicationStatusHistory.objects.create(
                application=application,
                status=application.status,
            )

    @action(
        detail=True,
        methods=["get"],
        url_path="status-history"
    )
    def status_history(self, request, pk=None):
        application = self.get_object()

        history = application.status_history.all()

        serializer = ApplicationStatusHistorySerializer(
            history,
            many=True
        )

        return Response(serializer.data)

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Resume.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_destroy(self, instance):
        if instance.file:
            instance.file.delete(save=False)

        instance.delete()

class InterviewRoundViewSet(viewsets.ModelViewSet):
    queryset = InterviewRound.objects.all()
    serializer_class = InterviewRoundSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return InterviewRound.objects.filter(
            application__owner=self.request.user
        )

    def perform_create(self, serializer):
        application = serializer.validated_data["application"]

        if application.owner != self.request.user:
            raise PermissionDenied(
                "You can only add interview rounds to your own applications."
            )

        serializer.save()


class OADeadlineViewSet(viewsets.ModelViewSet):
    queryset = OADeadline.objects.all()
    serializer_class = OADeadlineSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return OADeadline.objects.filter(
            owner=self.request.user,
            application__owner=self.request.user,
        )

    def perform_create(self, serializer):
        application = serializer.validated_data["application"]

        if application.owner != self.request.user:
            raise PermissionDenied(
                "You can only add OA deadlines to your own applications."
            )

        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        application = serializer.validated_data.get(
            "application",
            serializer.instance.application,
        )

        if application.owner != self.request.user:
            raise PermissionDenied(
                "You can only add OA deadlines to your own applications."
            )

        serializer.save(owner=self.request.user)


class ApplicationNoteViewSet(viewsets.ModelViewSet):
    queryset = ApplicationNote.objects.all()
    serializer_class = ApplicationNoteSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ApplicationNote.objects.filter(
            owner=self.request.user,
            application__owner=self.request.user,
        )

    def perform_create(self, serializer):
        application = serializer.validated_data["application"]

        if application.owner != self.request.user:
            raise PermissionDenied(
                "You can only add notes to your own applications."
            )

        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        application = serializer.validated_data.get(
            "application",
            serializer.instance.application,
        )

        if application.owner != self.request.user:
            raise PermissionDenied(
                "You can only add notes to your own applications."
            )

        serializer.save(owner=self.request.user)


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tag.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        applications = serializer.validated_data.get(
            "applications", []
        )

        if any(
            application.owner != self.request.user
            for application in applications
        ):
            raise PermissionDenied(
                "You can only tag your own applications."
            )

        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        applications = serializer.validated_data.get(
            "applications",
            serializer.instance.applications.all(),
        )

        if any(
            application.owner != self.request.user
            for application in applications
        ):
            raise PermissionDenied(
                "You can only tag your own applications."
            )

        serializer.save(owner=self.request.user)
