from rest_framework.routers import DefaultRouter
from django.urls import path

from .auth_views import AdminLoginView, AdminLogoutView
from .views import ProjectViewSet

router = DefaultRouter()
router.register("", ProjectViewSet, basename="project")

urlpatterns = [
    path("auth/login/", AdminLoginView.as_view(), name="admin-login"),
    path("auth/logout/", AdminLogoutView.as_view(), name="admin-logout"),
] + router.urls
