from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR / ".env.local", override=True)

from .base import *  # noqa: F401,F403

DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# A fresh local checkout should be able to run Django commands without a
# PostgreSQL service.  Provide DB_* values in .env.local to use PostgreSQL.
if not os.getenv("DB_NAME"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

CSRF_TRUSTED_ORIGINS = ["http://localhost", "http://127.0.0.1"]

AZURE_AD_REDIRECT_URI = os.getenv("AZURE_AD_REDIRECT_URI", "")

POST_LOGOUT_REDIRECT_URI = os.getenv("POST_LOGOUT_REDIRECT_URI", "")

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

REACT_APP_URL = os.getenv("REACT_APP_URL", "")
