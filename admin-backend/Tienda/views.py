from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAdminUser
from .models import (
    Categoria, Marca, Talla, Color, Producto,
    ImagenProducto, CombinacionProducto, Direccion,
    Orden, OrdenItem
)
from .serializers import (
    CategoriaSerializer, MarcaSerializer, TallaSerializer,
    ColorSerializer, ProductoSerializer, ImagenProductoSerializer,
    CombinacionProductoSerializer, DireccionSerializer, OrdenSerializer,
    OrdenItemSerializer, ProductoDetalleSerializer
)

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['activo', 'nombre']
    search_fields = ['nombre']
    ordering_fields = ['nombre', 'creado']

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['activo', 'nombre']
    search_fields = ['nombre']
    ordering_fields = ['nombre', 'creado']

class TallaViewSet(viewsets.ModelViewSet):
    queryset = Talla.objects.all()
    serializer_class = TallaSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['nombre']
    search_fields = ['nombre']
    ordering_fields = ['nombre']

class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['nombre']
    search_fields = ['nombre']
    ordering_fields = ['nombre']

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().select_related('marca', 'categoria')
    serializer_class = ProductoSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['marca', 'categoria', 'activo', 'es_destacado']
    search_fields = ['nombre', 'descripcion', 'sku']
    ordering_fields = ['precio', 'nombre', 'creado']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductoDetalleSerializer
        return ProductoSerializer

class ImagenProductoViewSet(viewsets.ModelViewSet):
    queryset = ImagenProducto.objects.all()
    serializer_class = ImagenProductoSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['producto', 'es_principal']
    ordering_fields = ['orden', 'creado']

class CombinacionProductoViewSet(viewsets.ModelViewSet):
    queryset = CombinacionProducto.objects.all().select_related('producto', 'talla', 'color')
    serializer_class = CombinacionProductoSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['producto', 'talla', 'color']
    ordering_fields = ['stock', 'sku']

class DireccionViewSet(viewsets.ModelViewSet):
    queryset = Direccion.objects.all().select_related('usuario')
    serializer_class = DireccionSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['usuario', 'departamento', 'provincia', 'distrito']
    search_fields = ['nombre', 'apellido', 'calle', 'referencia']
    ordering_fields = ['creado']

class OrdenViewSet(viewsets.ModelViewSet):
    queryset = Orden.objects.all().select_related('usuario', 'direccion_envio').prefetch_related('items')
    serializer_class = OrdenSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['usuario', 'estado', 'estado_pago', 'metodo_pago']
    search_fields = ['usuario__username', 'direccion_envio__calle']
    ordering_fields = ['fecha_creacion', 'total']

class OrdenItemViewSet(viewsets.ModelViewSet):
    queryset = OrdenItem.objects.all().select_related('orden', 'combinacion')
    serializer_class = OrdenItemSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['orden', 'combinacion']
    ordering_fields = ['creado']