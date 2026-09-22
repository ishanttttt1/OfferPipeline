from django.db import transaction
from django.db.models import Q

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Application, ApplicationStatusHistory, Company
from .serializers import (
    ApplicationSerializer,
    ApplicationStatusHistorySerializer,
    CompanySerializer,
)
from users.permissions import IsOwner


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