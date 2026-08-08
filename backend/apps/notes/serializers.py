from django.utils.text import slugify
from rest_framework import serializers

from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = "__all__"

    def validate_slug(self, value):
        return slugify(value)
