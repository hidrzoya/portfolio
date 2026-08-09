"""Import the local SQLite portfolio data into the configured production DB."""

import sqlite3
from pathlib import Path

from django.contrib.auth import get_user_model
from django.core.files import File
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.dateparse import parse_date, parse_datetime

from apps.notes.models import Note
from apps.projects.models import Project, ProjectImage


class Command(BaseCommand):
    help = "Import projects, notes, staff users, and media from a local SQLite portfolio database."

    def add_arguments(self, parser):
        parser.add_argument("--sqlite", required=True, help="Path to the source SQLite database.")
        parser.add_argument("--media-root", required=True, help="Directory containing the source media files.")
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete existing projects and notes in the target database before import.",
        )

    def handle(self, *args, **options):
        sqlite_path = Path(options["sqlite"]).resolve()
        media_root = Path(options["media_root"]).resolve()
        if not sqlite_path.is_file():
            raise CommandError(f"SQLite database not found: {sqlite_path}")
        if not media_root.is_dir():
            raise CommandError(f"Media directory not found: {media_root}")

        source = sqlite3.connect(sqlite_path)
        source.row_factory = sqlite3.Row
        try:
            with transaction.atomic():
                if options["clear"]:
                    ProjectImage.objects.all().delete()
                    Project.objects.all().delete()
                    Note.objects.all().delete()

                users = self._rows(source, "auth_user")
                notes = self._rows(source, "notes_note")
                projects = self._rows(source, "projects_project")
                # Older local databases may predate the gallery-image migration.
                gallery_images = self._rows(source, "projects_projectimage", optional=True)

                self._import_users(users)
                self._import_notes(notes)
                project_map = self._import_projects(projects, media_root)
                self._import_gallery_images(gallery_images, project_map, media_root)
        finally:
            source.close()

        self.stdout.write(
            self.style.SUCCESS(
                f"Imported {len(projects)} projects, {len(gallery_images)} gallery images, "
                f"{len(notes)} notes, and {len(users)} users."
            )
        )

    @staticmethod
    def _rows(connection, table, optional=False):
        try:
            return connection.execute(f"SELECT * FROM {table}").fetchall()
        except sqlite3.OperationalError as error:
            if optional and "no such table" in str(error):
                return []
            raise CommandError(f"Could not read expected table {table}: {error}") from error

    def _import_users(self, rows):
        user_model = get_user_model()
        for row in rows:
            username_field = user_model.USERNAME_FIELD
            username = row[username_field]
            user, _ = user_model.objects.get_or_create(**{username_field: username})
            for field in (
                "password",
                "is_superuser",
                "first_name",
                "last_name",
                "email",
                "is_staff",
                "is_active",
            ):
                if field in row.keys():
                    setattr(user, field, row[field])
            if "last_login" in row.keys() and row["last_login"]:
                user.last_login = parse_datetime(row["last_login"])
            if "date_joined" in row.keys() and row["date_joined"]:
                user.date_joined = parse_datetime(row["date_joined"])
            user.save()

    def _import_notes(self, rows):
        for row in rows:
            note, _ = Note.objects.update_or_create(
                slug=row["slug"],
                defaults={
                    "title": row["title"],
                    "excerpt": row["excerpt"],
                    "content": row["content"],
                    "published_at": parse_date(row["published_at"]),
                },
            )
            if row["created_at"]:
                Note.objects.filter(pk=note.pk).update(created_at=parse_datetime(row["created_at"]))

    def _import_projects(self, rows, media_root):
        project_map = {}
        for row in rows:
            image = self._file_from_media(row["image"], media_root)
            project = Project.objects.create(
                title=row["title"],
                description=row["description"],
                tech_stack=row["tech_stack"],
                project_url=row["project_url"],
                github_url=row["github_url"],
                display_order=row["display_order"],
            )
            if image:
                project.image.save(image.name, image, save=False)
                project.save(update_fields=["image"])
            if row["created_at"]:
                Project.objects.filter(pk=project.pk).update(created_at=parse_datetime(row["created_at"]))
            project_map[row["id"]] = project
        return project_map

    def _import_gallery_images(self, rows, project_map, media_root):
        for row in rows:
            project = project_map.get(row["project_id"])
            image = self._file_from_media(row["image"], media_root)
            if not project or not image:
                continue
            gallery_image = ProjectImage(project=project)
            gallery_image.image.save(image.name, image, save=False)
            gallery_image.save()
            if row["created_at"]:
                ProjectImage.objects.filter(pk=gallery_image.pk).update(
                    created_at=parse_datetime(row["created_at"])
                )

    @staticmethod
    def _file_from_media(stored_name, media_root):
        if not stored_name:
            return None
        file_path = media_root / stored_name
        if not file_path.is_file():
            raise CommandError(f"Referenced media file not found: {file_path}")
        return File(file_path.open("rb"), name=file_path.name)
