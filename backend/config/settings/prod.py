from .base import *  # noqa: F401,F403
from django.core.exceptions import ImproperlyConfigured

DEBUG = False
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
# Vercel terminates TLS before forwarding requests to Django. The public
# deployment is HTTPS-only, so an application-level redirect would create a
# redirect response when the platform omits the forwarded-proto header.
SECURE_SSL_REDIRECT = os.getenv("SECURE_SSL_REDIRECT", "False").lower() == "true"
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_HSTS_SECONDS = 31_536_000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"

required_settings = {
    "SECRET_KEY": SECRET_KEY,
    "ALLOWED_HOSTS": ALLOWED_HOSTS,
    "CORS_ALLOWED_ORIGINS": CORS_ALLOWED_ORIGINS,
    "CSRF_TRUSTED_ORIGINS": CSRF_TRUSTED_ORIGINS,
    "DATABASE_URL": DATABASE_URL,
}
missing_settings = [name for name, value in required_settings.items() if not value]
if missing_settings:
    raise ImproperlyConfigured(
        "Missing required production environment variables: " + ", ".join(missing_settings)
    )
