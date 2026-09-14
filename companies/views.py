from django.db import transaction

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Application, ApplicationStatusHistory, Company
from .serializers import (
    ApplicationSerializer,
    ApplicationStatusHistorySerializer,
    CompanySerializer,
)
from users.permissions import IsOwner


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

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Application.objects.filter(owner=self.request.user)

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