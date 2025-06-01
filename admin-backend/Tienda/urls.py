from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoriaViewSet, MarcaViewSet, TallaViewSet,
    ColorViewSet, ProductoViewSet, ImagenProductoViewSet,
    CombinacionProductoViewSet, DireccionViewSet, OrdenViewSet,
    OrdenItemViewSet
)

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
    path('', include(router.urls)),
]