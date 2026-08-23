from rest_framework.routers import DefaultRouter

from .views import CompanyViewSet


router = DefaultRouter()
router.register("companies", CompanyViewSet, basename="company")

urlpatterns = router.urls