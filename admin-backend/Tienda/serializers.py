from rest_framework import serializers
from .models import (
    Categoria, Marca, Talla, Color, Producto,
    ImagenProducto, CombinacionProducto, Direccion,
    Orden, OrdenItem
)
from django.contrib.auth import get_user_model

User = get_user_model()

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'slug', 'imagen', 'activo', 'creado', 'actualizado']
        read_only_fields = ['creado', 'actualizado']

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ['id', 'nombre', 'slug', 'imagen', 'activo', 'creado', 'actualizado']
        read_only_fields = ['creado', 'actualizado']

class TallaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Talla
        fields = ['id', 'nombre']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'nombre', 'codigo_hex']

class ImagenProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenProducto
        fields = ['id', 'producto', 'imagen', 'es_principal', 'orden', 'creado', 'actualizado']
        read_only_fields = ['creado', 'actualizado']

class CombinacionProductoSerializer(serializers.ModelSerializer):
    talla_nombre = serializers.ReadOnlyField(source='talla.nombre')
    color_nombre = serializers.ReadOnlyField(source='color.nombre')
    color_hex = serializers.ReadOnlyField(source='color.codigo_hex')

    class Meta:
        model = CombinacionProducto
        fields = ['id', 'producto', 'talla', 'talla_nombre', 'color', 'color_nombre',
                 'color_hex', 'stock', 'sku']

class ProductoSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.ReadOnlyField(source='marca.nombre')
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    imagen_principal_url = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'slug', 'descripcion', 'sku', 'marca', 'marca_nombre',
                 'categoria', 'categoria_nombre', 'precio', 'precio_oferta',
                 'activo', 'es_destacado', 'imagen_principal_url', 'creado', 'actualizado']
        read_only_fields = ['creado', 'actualizado']

    def get_imagen_principal_url(self, obj):
        if obj.imagen_principal and obj.imagen_principal.imagen:
            return obj.imagen_principal.imagen.url
        return None

class ProductoDetalleSerializer(ProductoSerializer):
    imagenes = ImagenProductoSerializer(many=True, read_only=True)
    combinaciones = CombinacionProductoSerializer(many=True, read_only=True)

    class Meta(ProductoSerializer.Meta):
        fields = ProductoSerializer.Meta.fields + ['imagenes', 'combinaciones']

class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = ['id', 'usuario', 'nombre', 'apellido', 'departamento', 'provincia',
                 'distrito', 'calle', 'codigo_postal', 'referencia', 'telefono',
                 'creado', 'actualizado']
        read_only_fields = ['creado', 'actualizado']

class OrdenItemSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.ReadOnlyField(source='combinacion.producto.nombre')
    talla = serializers.ReadOnlyField(source='combinacion.talla.nombre')
    color = serializers.ReadOnlyField(source='combinacion.color.nombre')

    class Meta:
        model = OrdenItem
        fields = ['id', 'orden', 'combinacion', 'producto_nombre', 'talla', 'color',
                 'cantidad', 'precio_unitario', 'subtotal', 'creado', 'actualizado']
        read_only_fields = ['subtotal', 'creado', 'actualizado']

class OrdenSerializer(serializers.ModelSerializer):
    items = OrdenItemSerializer(many=True, read_only=True)
    usuario_nombre = serializers.ReadOnlyField(source='usuario.username')
    direccion_completa = serializers.ReadOnlyField(source='direccion_envio.__str__')

    class Meta:
        model = Orden
        fields = ['id', 'usuario', 'usuario_nombre', 'direccion_envio', 'direccion_completa',
                 'total', 'metodo_pago', 'estado_pago', 'estado', 'cantidad_compra',
                 'fecha_creacion', 'fecha_actualizacion', 'items']
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']