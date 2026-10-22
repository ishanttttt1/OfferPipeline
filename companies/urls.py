
from rest_framework.routers import DefaultRouter

from .views import (
    AnalyticsViewSet,
    ApplicationViewSet,
    CompanyViewSet,
    ResumeViewSet,
    InterviewRoundViewSet,
    OADeadlineViewSet,
    ApplicationNoteViewSet,
    TagViewSet,
)

router = DefaultRouter()
router.register("analytics",AnalyticsViewSet,basename="analytics",)
router.register("applications", ApplicationViewSet, basename="application")
router.register("resumes", ResumeViewSet, basename="resume")
router.register("interview-rounds",InterviewRoundViewSet,basename="interview-round",)
router.register("oa-deadlines",OADeadlineViewSet,basename="oa-deadline",)
router.register("application-notes",ApplicationNoteViewSet,basename="application-note",)
router.register("tags",TagViewSet,basename="tag",)
router.register("", CompanyViewSet, basename="company")
urlpatterns = router.urls
