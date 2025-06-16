from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoriaViewSet, MarcaViewSet, TallaViewSet,
    ColorViewSet, ProductoViewSet, ImagenProductoViewSet,
    CombinacionProductoViewSet, DireccionViewSet, OrdenViewSet,
    OrdenItemViewSet
)
from .views_auth import login_view, logout_view, user_view  # Importa las vistas de auth

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'marcas', MarcaViewSet)
router.register(r'tallas', TallaViewSet)
router.register(r'colores', ColorViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'imagenes-producto', ImagenProductoViewSet)
router.register(r'combinaciones-producto', CombinacionProductoViewSet)
router.register(r'direcciones', DireccionViewSet)
router.register(r'ordenes', OrdenViewSet)
router.register(r'orden-items', OrdenItemViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Rutas de los ViewSets
    # Rutas para autenticación por sesión
    path('auth/login/', login_view),
    path('auth/logout/', logout_view),
    path('auth/user/', user_view),
]