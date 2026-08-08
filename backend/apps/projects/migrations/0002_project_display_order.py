from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("projects", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="display_order",
            field=models.PositiveIntegerField(default=999, help_text="Lower numbers are shown first."),
        ),
        migrations.AlterModelOptions(
            name="project",
            options={"ordering": ["display_order", "-created_at"]},
        ),
    ]
