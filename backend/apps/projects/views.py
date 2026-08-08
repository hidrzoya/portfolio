from django.db import transaction

from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Project, ProjectImage
from .serializers import ProjectSerializer


class ProjectViewSet(ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.order_by("display_order", "-created_at")

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsAdminUser()]

    def save_gallery_images(self, project):
        for image in self.request.FILES.getlist("gallery"):
            ProjectImage.objects.create(project=project, image=image)

    def set_display_order(self, project, requested_order):
        other_projects = list(Project.objects.exclude(pk=project.pk).order_by("display_order", "id"))
        position = len(other_projects) if not requested_order else min(max(requested_order - 1, 0), len(other_projects))
        other_projects.insert(position, project)

        for index, item in enumerate(other_projects, start=1):
            if item.display_order != index:
                Project.objects.filter(pk=item.pk).update(display_order=index)
            if item.pk == project.pk:
                project.display_order = index

    def perform_create(self, serializer):
        with transaction.atomic():
            requested_order = serializer.validated_data.get("display_order", 0)
            project = serializer.save()
            self.set_display_order(project, requested_order)
            self.save_gallery_images(project)

    def perform_update(self, serializer):
        with transaction.atomic():
            requested_order = serializer.validated_data.get("display_order", serializer.instance.display_order)
            project = serializer.save()
            self.set_display_order(project, requested_order)
            self.save_gallery_images(project)

    @action(detail=True, methods=["delete"], url_path="cover-image")
    def delete_cover_image(self, request, pk=None):
        project = self.get_object()
        if project.image:
            project.image.delete(save=False)
            project.image = None
            project.save(update_fields=["image"])
        return Response(status=204)

    @action(detail=True, methods=["delete"], url_path=r"images/(?P<image_id>[^/.]+)")
    def delete_gallery_image(self, request, pk=None, image_id=None):
        image = ProjectImage.objects.filter(pk=image_id, project_id=pk).first()
        if not image:
            return Response({"detail": "Image not found."}, status=404)
        image.image.delete(save=False)
        image.delete()
        return Response(status=204)
