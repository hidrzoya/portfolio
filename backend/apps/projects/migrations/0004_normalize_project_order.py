from django.db import migrations, models


def normalize_project_order(apps, schema_editor):
    Project = apps.get_model("projects", "Project")
    for order, project in enumerate(Project.objects.order_by("display_order", "created_at", "id"), start=1):
        Project.objects.filter(pk=project.pk).update(display_order=order)


class Migration(migrations.Migration):
    dependencies = [
        ("projects", "0003_projectimage"),
    ]

    operations = [
        migrations.AlterField(
            model_name="project",
            name="display_order",
            field=models.PositiveIntegerField(default=0, help_text="Project position. Projects are numbered starting at 1."),
        ),
        migrations.RunPython(normalize_project_order, migrations.RunPython.noop),
    ]
