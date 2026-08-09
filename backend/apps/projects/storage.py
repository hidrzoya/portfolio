"""Django storage adapter for public Vercel Blob project images."""

from django.conf import settings
from django.core.files.storage import FileSystemStorage, Storage


class VercelBlobStorage(Storage):
    """Use Vercel Blob in deployments and local media files during development."""

    def __eq__(self, other):
        return isinstance(other, VercelBlobStorage)

    def __hash__(self):
        return hash(VercelBlobStorage)

    def __init__(self):
        self._local_storage = FileSystemStorage(
            location=settings.MEDIA_ROOT,
            base_url=settings.MEDIA_URL,
        )
        self._client = None

    @property
    def uses_blob(self):
        # Production Vercel connections may authenticate through OIDC and do
        # not expose a long-lived BLOB_READ_WRITE_TOKEN variable.
        return not settings.DEBUG or bool(getattr(settings, "BLOB_READ_WRITE_TOKEN", ""))

    def _blob_client(self):
        if self._client is None:
            from vercel.blob import BlobClient

            self._client = BlobClient(token=getattr(settings, "BLOB_READ_WRITE_TOKEN", "") or None)
        return self._client

    def _save(self, name, content):
        if not self.uses_blob:
            return self._local_storage.save(name, content)

        result = self._blob_client().put(
            name,
            content.read(),
            access="public",
            content_type=getattr(content, "content_type", None),
            add_random_suffix=True,
        )
        return result.url

    def get_available_name(self, name, max_length=None):
        # Blob adds a random suffix, so a pre-flight collision check is not needed.
        return name

    def delete(self, name):
        if not name:
            return
        if not self.uses_blob:
            return self._local_storage.delete(name)
        self._blob_client().delete(name)

    def exists(self, name):
        if not self.uses_blob:
            return self._local_storage.exists(name)
        return False

    def url(self, name):
        if name.startswith(("https://", "http://")):
            return name
        return self._local_storage.url(name)

    def path(self, name):
        if self.uses_blob:
            raise NotImplementedError("Vercel Blob files do not have a local filesystem path.")
        return self._local_storage.path(name)
