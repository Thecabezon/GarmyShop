# serializers.py - VERSIÓN CON LA CORRECCIÓN FINAL

from rest_framework import serializers
from .models import (
    Categoria, Marca, Talla, Color, Producto,
    ImagenProducto, CombinacionProducto, Direccion,
    Orden, OrdenItem
)
from django.contrib.auth import get_user_model

User = get_user_model()

# Función auxiliar para obtener la URL pública de un campo de imagen de Cloudinary
def get_cloudinary_image_url(image_field):
    if image_field and hasattr(image_field, 'url'):
        return image_field.url
    return None


class CategoriaSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'slug', 'imagen', 'imagen_url', 'activo', 'creado', 'actualizado']
        read_only_fields = ['creado', 'actualizado']

    def get_imagen_url(self, obj):
        return get_cloudinary_image_url(obj.imagen)


class MarcaSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = Marca
        fields = ['id', 'nombre', 'slug', 'imagen', 'imagen_url', 'activo', 'creado', 'actualizado']
        read_only_fields = ['creado', 'actualizado']

    def get_imagen_url(self, obj):
        return get_cloudinary_image_url(obj.imagen)


class TallaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Talla
        fields = ['id', 'nombre']


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'nombre', 'codigo_hex']


class ImagenProductoSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = ImagenProducto
        fields = ['id', 'producto', 'imagen', 'imagen_url', 'es_principal', 'orden', 'creado', 'actualizado']
        read_only_fields = ['creado', 'actualizado']

    def get_imagen_url(self, obj):
        return get_cloudinary_image_url(obj.imagen)


# ================================================================
#               👇 LA ÚNICA MODIFICACIÓN ESTÁ AQUÍ 👇
# ================================================================
class CombinacionProductoSerializer(serializers.ModelSerializer):
    talla_nombre = serializers.ReadOnlyField(source='talla.nombre')
    color_nombre = serializers.ReadOnlyField(source='color.nombre')
    color_hex = serializers.ReadOnlyField(source='color.codigo_hex')

    class Meta:
        model = CombinacionProducto
        # Se ha añadido 'producto' a la lista de campos
        fields = ['id', 'producto', 'talla', 'talla_nombre', 'color', 'color_nombre', 'color_hex', 'stock', 'sku']


class ProductoSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.ReadOnlyField(source='marca.nombre')
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    imagen_principal_url = serializers.SerializerMethodField()
    # Ahora que gestionamos combinaciones por separado, este campo ya no es necesario para escritura.
    # Podríamos hacerlo read_only si quisiéramos mostrarlo en el detalle del producto.
    combinaciones = CombinacionProductoSerializer(many=True, read_only=True) # Hacemos que sea solo de lectura

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'slug', 'descripcion', 'sku',
            'marca', 'marca_nombre',
            'categoria', 'categoria_nombre',
            'precio', 'precio_oferta',
            'activo', 'es_destacado',
            'imagen_principal_url',
            'creado', 'actualizado',
            'combinaciones',
        ]
        read_only_fields = ['creado', 'actualizado']
    
    # Ya no necesitamos los métodos create() y update() que manejaban las combinaciones anidadas
    # Django REST Framework se encargará de las operaciones simples.

    def get_imagen_principal_url(self, obj):
        imagen_principal_instance = obj.imagen_principal
        return get_cloudinary_image_url(imagen_principal_instance.imagen if imagen_principal_instance else None)

    def validate(self, data):
        precio = data.get('precio')
        precio_oferta = data.get('precio_oferta')
        instance = getattr(self, 'instance', None)

        if instance and precio is None:
            precio = instance.precio

        if precio_oferta is not None and precio is not None and precio_oferta >= precio:
            raise serializers.ValidationError("El precio en oferta debe ser menor que el precio normal.")
        
        # Ya no se validan las combinaciones aquí
        return data


class ProductoDetalleSerializer(ProductoSerializer):
    imagenes = ImagenProductoSerializer(many=True, read_only=True)
    combinaciones = CombinacionProductoSerializer(many=True, read_only=True)

    class Meta(ProductoSerializer.Meta):
        fields = ProductoSerializer.Meta.fields + ['imagenes']


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