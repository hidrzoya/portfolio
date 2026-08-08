from django.db import models


class Note(models.Model):
    slug = models.SlugField(max_length=180, unique=True)
    title = models.CharField(max_length=255)
    excerpt = models.TextField()
    content = models.TextField()
    published_at = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title
