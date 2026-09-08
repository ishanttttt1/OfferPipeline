from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from companies.views import ApplicationViewSet


application_router = DefaultRouter()
application_router.register("", ApplicationViewSet, basename="application")


urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/auth/", include("users.urls")),

    path("api/companies/", include("companies.urls")),

    path("api/applications/", include(application_router.urls)),
]