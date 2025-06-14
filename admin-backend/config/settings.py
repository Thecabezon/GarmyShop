from pathlib import Path
import os

import cloudinary
import cloudinary.uploader
import cloudinary.api
from cloudinary import CloudinaryImage


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-yfv63^18cc8e#i)%ujm^$d&69nhg^i6j47!!l&$nrnmu^wr4qh'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'Tienda',
    'corsheaders',
    'rest_framework',
    'cloudinary',
    'cloudinary_storage',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'railway',  # El nombre de tu base de datos
        'USER': 'root',  # El usuario que usas en DBeaver
        'PASSWORD': 'sFtCxHaXqPdhtHixpZFUOyWOejwkeChW',  # La contraseña de ese usuario 
        'HOST': 'shortline.proxy.rlwy.net',  # El host que ves en DBeaver
        'PORT': '22085',  # El puerto que ves en DBeaver #22085
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}



# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# MEDIA_URL = '/media/'
# MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Configuración de Cloudinary
cloudinary.config(
    cloud_name="dz96emvug",
    api_key="825955928148379",
    api_secret="WniyC8xnJqbUW_95ncYVarxMQNQ",
    secure=True
)

# Configuración de almacenamiento
CLOUDINARY_STORAGE = {  
    'CLOUD_NAME': 'dz96emvug',
    'API_KEY': '825955928148379',
    'API_SECRET': 'WniyC8xnJqbUW_95ncYVarxMQNQ'
}

# Usar Cloudinary como storage por defecto para archivos multimedia
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# Lista de orígenes que tienen permitido hacer peticiones
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3002', # El origen de tu app de React
    'http://127.0.0.1:3002',
]

# Opcionalmente, para desarrollo puedes permitir todos los orígenes (no recomendado para producción)
# CORS_ALLOW_ALL_ORIGINS = True