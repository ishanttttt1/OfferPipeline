from rest_framework.routers import DefaultRouter

from .views import ApplicationViewSet, CompanyViewSet, ResumeViewSet


router = DefaultRouter()

router.register("applications", ApplicationViewSet, basename="application")
router.register("resumes", ResumeViewSet, basename="resume")
router.register("", CompanyViewSet, basename="company")

urlpatterns = router.urls