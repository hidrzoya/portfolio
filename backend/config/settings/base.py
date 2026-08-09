import os
from pathlib import Path

import dj_database_url

# =========================================================================
# PATHS & ENVIRONMENT
# ========================================================================

BASE_DIR = Path(__file__).resolve().parents[2]

def env_list(name, default=None):
    raw_value = os.getenv(name, default)
    if not raw_value:
        return []
    return [item.strip() for item in raw_value.split(",") if item.strip()]

# =========================================================================
# CORE DJANGO SETTINGS
# ========================================================================

# Use the standard Django names documented in `.env.example`.  The legacy
# names remain as fallbacks so existing deployments do not break.
SECRET_KEY = os.getenv("SECRET_KEY") or os.getenv("DSECRET_KEY", "")
DEBUG = (os.getenv("DEBUG") or os.getenv("DJANGO_DEBUG", "False")).lower() == "true"
ALLOWED_HOSTS = env_list("ALLOWED_HOSTS")

CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS")
CORS_ALLOWED_ORIGINS = env_list("CORS_ALLOWED_ORIGINS")
CORS_ALLOW_CREDENTIALS = True

AZURE_AD_REDIRECT_URI = os.getenv("AZURE_AD_REDIRECT_URI", "")
POST_LOGOUT_REDIRECT_URI = os.getenv("POST_LOGOUT_REDIRECT_URI", "")
REACT_LOGIN_SUCCESS_URL = os.getenv("REACT_LOGIN_SUCCESS_URL", "")
LOCAL_DEV_AUTH_BYPASS = os.getenv("LOCAL_DEV_AUTH_BYPASS", "False").lower() == "true"
LOCAL_DEV_AUTH_BYPASS_USER = os.getenv("LOCAL_DEV_AUTH_BYPASS_USER", "testuser")
LOCAL_DEV_AUTH_EMAIL = os.getenv("LOCAL_DEV_AUTH_EMAIL", "testuser@example.com")
LOCAL_DEV_AUTH_FIRST_NAME = os.getenv("LOCAL_DEV_AUTH_FIRST_NAME", "Test")
LOCAL_DEV_AUTH_LAST_NAME = os.getenv("LOCAL_DEV_AUTH_LAST_NAME", "User")
# APP_NAME = os.getenv("APP_NAME", "MyApp")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
BLOB_READ_WRITE_TOKEN = os.getenv("BLOB_READ_WRITE_TOKEN", "")

# =========================================================================
# DJANGO APPS & MIDDLEWARE
# ========================================================================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "apps.projects",
    "apps.notes",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
    ],
}

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASE_URL = os.getenv("DATABASE_URL", "")

if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("DB_NAME"),
            "USER": os.getenv("DB_USER"),
            "PASSWORD": os.getenv("DB_PASSWORD"),
            "HOST": os.getenv("DB_HOST"),
            "PORT": os.getenv("DB_PORT", "5432"),
            "OPTIONS": {
                "sslmode": os.getenv("DB_SSLMODE", "disable"),
            },
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
