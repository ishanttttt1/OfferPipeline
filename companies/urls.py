from rest_framework.routers import DefaultRouter

from .views import (
    ApplicationViewSet,
    CompanyViewSet,
    ResumeViewSet,
    InterviewRoundViewSet,
)


router = DefaultRouter()

router.register("applications", ApplicationViewSet, basename="application")
router.register("resumes", ResumeViewSet, basename="resume")
router.register(
    "interview-rounds",
    InterviewRoundViewSet,
    basename="interview-round"
)
router.register("", CompanyViewSet, basename="company")

urlpatterns = router.urls