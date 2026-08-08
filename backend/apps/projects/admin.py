from django.contrib import admin

from .models import Project, ProjectImage


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 0


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("display_order", "title", "tech_stack", "created_at")
    list_display_links = ("title",)
    list_editable = ("display_order",)
    search_fields = ("title", "description", "tech_stack")
    readonly_fields = ("created_at",)
    inlines = (ProjectImageInline,)
