from rest_framework.routers import DefaultRouter

from .views import ApplicationViewSet, CompanyViewSet


router = DefaultRouter()

router.register("applications", ApplicationViewSet, basename="application")
router.register("", CompanyViewSet, basename="company")

urlpatterns = router.urls