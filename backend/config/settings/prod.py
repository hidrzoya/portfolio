from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

from .base import *  # noqa: F401,F403

DEBUG = False
ALLOWED_HOSTS = env_list("ALLOWED_HOSTS", "")
CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS", "")
CORS_ALLOWED_ORIGINS = env_list("CORS_ALLOWED_ORIGINS", "")

# FOR SSO
# AZURE_AD_REDIRECT_URI = os.getenv("AZURE_AD_REDIRECT_URI", "") 
# POST_LOGOUT_REDIRECT_URI = os.getenv("POST_LOGOUT_REDIRECT_URI", "")
# REACT_APP_URL = os.getenv("REACT_APP_URL", "")


SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
