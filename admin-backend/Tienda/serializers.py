# serializers.py - VERSIÓN CORREGIDA DEFINITIVA (VALIDACIÓN SKU)

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


class CombinacionProductoSerializer(serializers.ModelSerializer):
    talla_nombre = serializers.ReadOnlyField(source='talla.nombre')
    color_nombre = serializers.ReadOnlyField(source='color.nombre')
    color_hex = serializers.ReadOnlyField(source='color.codigo_hex')

    class Meta:
        model = CombinacionProducto
        fields = ['id', 'talla', 'talla_nombre', 'color', 'color_nombre', 'color_hex', 'stock', 'sku']

    # 🔥 REMOVEMOS LA VALIDACIÓN DEL SKU AQUÍ (ya se hace en ProductoSerializer)
    # La validación se hará a nivel del ProductoSerializer para tener mejor contexto


class ProductoSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.ReadOnlyField(source='marca.nombre')
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    imagen_principal_url = serializers.SerializerMethodField()

    # ✅ Las combinaciones se pueden escribir/leer anidadas
    combinaciones = CombinacionProductoSerializer(many=True)

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

        # 🔥 VALIDACIÓN PARA SKUs Y UNICIDAD DE COMBINACIONES
        combinaciones_data = data.get('combinaciones', [])
        if combinaciones_data:
            # Pasar la instancia (el producto que se edita) a las validaciones
            self._validate_skus_combinaciones(combinaciones_data, instance)
            self._validate_combinaciones_unicidad(combinaciones_data, instance)

        return data

    def _validate_skus_combinaciones(self, combinaciones_data, producto_instance):
        """
        Valida que los SKUs de las combinaciones sean únicos globalmente,
        pero excluye la combinación específica que se está editando/creando si tiene un ID.
        """
        skus_en_request = []

        for i, combinacion_data_item in enumerate(combinaciones_data):
            sku = combinacion_data_item.get('sku')
            # Obtenemos el ID del item de combinación recibido del frontend
            combinacion_id_from_frontend = combinacion_data_item.get('id')

            if not sku:
                # Saltar si no hay SKU (la validación 'required' lo atrapará en el campo)
                continue

            # 1. Validar que no haya SKUs duplicados *dentro del mismo request payload*
            if sku in skus_en_request:
                # Apuntar el error al índice específico en el array 'combinaciones'
                raise serializers.ValidationError({
                    f'combinaciones[{i}]': f'El SKU "{sku}" está duplicado en las combinaciones enviadas.'
                })
            skus_en_request.append(sku)

            # 2. Validar unicidad global del SKU en la base de datos
            queryset = CombinacionProducto.objects.filter(sku=sku)

            # 🔥 CORRECCIÓN CRUCIAL: Excluir la combinación específica *actual* por su ID
            # Si el item de combinación del frontend tiene un ID (es una combinación existente),
            # la validación debe excluir la instancia de base de datos con ese mismo ID.
            if combinacion_id_from_frontend is not None:
                 queryset = queryset.exclude(id=combinacion_id_from_frontend)

            # Si después de la exclusión, el queryset todavía tiene resultados,
            # significa que el SKU está en uso por *otra* combinación en la base de datos.
            if queryset.exists():
                combinacion_existente = queryset.first()
                producto_existente = combinacion_existente.producto
                 # Apuntar el error al índice específico en el array 'combinaciones'
                raise serializers.ValidationError({
                    f'combinaciones[{i}]': f'El SKU "{sku}" ya existe en el producto "{producto_existente.nombre}" (ID: {producto_existente.id}).'
                })

    def _validate_combinaciones_unicidad(self, combinaciones_data, producto_instance):
        """
        Valida que no haya combinaciones duplicadas (misma talla + color) dentro del mismo producto.
        Verifica duplicados dentro del request y contra la BD existente (excluyendo items editados).
        """
        combinaciones_en_request = set()

        # 1. Validar unicidad dentro del request actual
        for i, combinacion_data_item in enumerate(combinaciones_data):
            talla_id = combinacion_data_item.get('talla')
            color_id = combinacion_data_item.get('color')

            if not talla_id or not color_id:
                # Saltar si faltan talla o color (la validación 'required' los atrapará)
                continue

            combinacion_key = (talla_id, color_id)

            if combinacion_key in combinaciones_en_request:
                # Apuntar el error al índice específico
                raise serializers.ValidationError({
                     f'combinaciones[{i}]': 'No puede haber combinaciones duplicadas (misma talla y color) en el mismo producto.'
                })

            combinaciones_en_request.add(combinacion_key)

        # 2. Si estamos editando, verificar contra combinaciones existentes en BD para este producto
        if producto_instance:
            # Obtener los IDs de las combinaciones que *existen en la BD* y están siendo enviadas
            ids_enviados_existentes = [item.get('id') for item in combinaciones_data if item.get('id')]

            for i, combinacion_data_item in enumerate(combinaciones_data):
                talla_id = combinacion_data_item.get('talla')
                color_id = combinacion_data_item.get('color')
                combinacion_id_from_frontend = combinacion_data_item.get('id') # ID del item del frontend

                if not talla_id or not color_id:
                    continue

                # Buscar si ya existe una combinación con esta talla y color para este producto en la BD
                existe_en_bd = CombinacionProducto.objects.filter(
                    producto=producto_instance,
                    talla_id=talla_id,
                    color_id=color_id
                )

                # Si estamos procesando un item que *tiene* un ID (es decir, existe en BD)
                # y estamos actualizando, debemos excluir esa instancia de BD de la verificación.
                if combinacion_id_from_frontend is not None:
                    existe_en_bd = existe_en_bd.exclude(id=combinacion_id_from_frontend)

                # Si después de la exclusión, el queryset todavía tiene resultados,
                # significa que ya existe *otra* combinación con la misma talla/color
                # para este producto en la BD (que no es la que estamos intentando actualizar).
                if existe_en_bd.exists():
                    # Apuntar el error al índice específico
                    raise serializers.ValidationError({
                        f'combinaciones[{i}]': 'Ya existe una combinación con esta talla y color en este producto.'
                    })


    def create(self, validated_data):
        combinaciones_data = validated_data.pop('combinaciones', [])
        producto = Producto.objects.create(**validated_data)

        for combinacion in combinaciones_data:
            # No esperamos IDs al crear, DRF los asignará
            CombinacionProducto.objects.create(producto=producto, **combinacion)

        return producto

    def update(self, instance, validated_data):
        combinaciones_data = validated_data.pop('combinaciones', [])

        # 🔥 DEBUG: Imprimir datos recibidos (mantengo esto útil)
        print("=== DEBUG COMBINACIONES UPDATE ===")
        print(f"Producto ID: {instance.id}")
        print(f"Combinaciones recibidas: {len(combinaciones_data)}")
        for i, comb in enumerate(combinaciones_data):
            # Print el ID tal como llega del frontend
            print(f"  Combinación {i}: ID={comb.get('id')}, SKU={comb.get('sku')}, Talla={comb.get('talla')}, Color={comb.get('color')}")

        # Actualiza los campos del producto principal
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # 🔥 LÓGICA MEJORADA PARA ACTUALIZAR COMBINACIONES
        # Asumimos que si combinaciones_data está vacío, se borraron todas las combinaciones
        # Si no está vacío, procesamos la lista recibida
        if combinaciones_data:
            # Obtener IDs de combinaciones que *existen en BD* y están siendo enviadas desde el frontend
            # Usamos is not None para incluir ID=0 si alguna vez fuera posible, aunque es improbable
            ids_enviados_existentes = [item.get('id') for item in combinaciones_data if item.get('id') is not None]
            print(f"IDs enviados que parecen existir (tienen ID): {ids_enviados_existentes}")

            # Eliminar combinaciones existentes para este producto que *no* están en la lista enviada
            # Esta lógica debe ser cuidadosa: solo eliminar si la lista enviada no está vacía
            # Y si estamos en un contexto donde hay combinaciones existentes que podrían eliminarse.
            # Si ids_enviados_existentes está vacío, podría significar que se están enviando solo items nuevos,
            # o que los IDs no están llegando. Si no hay IDs enviados pero hay combinaciones en la BD,
            # podríamos borrar *todas* las existentes, lo cual podría ser un error si los IDs no llegan.
            # Un enfoque más seguro podría ser solo eliminar si la lista enviada *contiene al menos un ID existente*
            # o si la lista enviada está vacía (indica borrado total).
            # Simplifiquemos: si la lista enviada NO está vacía, eliminamos las que no están en los IDs enviados.
            # Si la lista enviada está vacía, *sí* eliminamos todas las combinaciones del producto.

            # Obtener los IDs de las combinaciones que actualmente tiene el producto en la BD
            current_db_ids = list(instance.combinaciones.values_list('id', flat=True))
            print(f"IDs actuales en BD para este producto: {current_db_ids}")

            # IDs de combinaciones en BD que NO están en la lista enviada -> a eliminar
            ids_a_eliminar = [db_id for db_id in current_db_ids if db_id not in ids_enviados_existentes]
            print(f"IDs a eliminar: {ids_a_eliminar}")

            if ids_a_eliminar:
                 instance.combinaciones.filter(id__in=ids_a_eliminar).delete()


            # Procesar cada item de combinación recibido del frontend
            for item in combinaciones_data:
                # Creamos una copia del item para poder hacer pop('id', None) sin modificar el original
                # si necesitamos el original para otros fines, aunque aquí no parece ser el caso.
                # Es más seguro trabajar con una copia si el diccionario original viene de una lista que se itera.
                item_copy = item.copy() # Copiamos el diccionario
                comb_id = item_copy.pop('id', None) # Extraemos el ID de la copia

                print(f"Procesando item recibido: Original={item}, ID extraído={comb_id}, Datos para update/create={item_copy}")

                if comb_id is not None: # Usamos is not None para IDs que podrían ser 0 (aunque improbable)
                    # Intentamos actualizar una combinación existente usando el ID y el producto_instance
                    try:
                        # 🔥 Aseguramos que la combinación a actualizar pertenezca a este producto
                        combinacion_db = CombinacionProducto.objects.get(id=comb_id, producto=instance)
                        print(f"Encontrada combinación existente {comb_id} para actualizar")
                        for attr, value in item_copy.items(): # Usamos item_copy sin el ID
                            setattr(combinacion_db, attr, value)
                        combinacion_db.save()
                        print(f"Combinación {comb_id} actualizada")
                    except CombinacionProducto.DoesNotExist:
                         # Esto NO debería pasar si el frontend envía IDs válidos,
                         # pero lo manejamos por si acaso. Si un ID llega pero no existe,
                         # podría ser un dato viejo o erróneo. Decidimos crearla aquí.
                         print(f"ERROR: Combinación existente con ID {comb_id} no encontrada para el producto {instance.id}. Creando nueva en su lugar.")
                         CombinacionProducto.objects.create(producto=instance, **item_copy) # Usamos item_copy sin el ID
                         print(f"Nueva combinación creada con datos del ID no encontrado")
                else:
                    # Si el item no tiene ID, siempre creamos una nueva combinación
                    print(f"Item sin ID recibido, creando nueva combinación: {item_copy}")
                    CombinacionProducto.objects.create(producto=instance, **item_copy) # Usamos item_copy sin el ID
                    print(f"Nueva combinación creada")

        else: # Si combinaciones_data está vacío en el payload
            print("Lista de combinaciones recibida vacía. Eliminando todas las combinaciones para este producto.")
            instance.combinaciones.all().delete() # Eliminar todas las combinaciones si la lista está vacía

        print("=== FIN DEBUG COMBINACIONES UPDATE ===")
        return instance


class ProductoDetalleSerializer(ProductoSerializer):
    # Serializador para el detalle (hereda campos de ProductoSerializer)
    # Incluye las imágenes adicionales y las combinaciones
    imagenes = ImagenProductoSerializer(many=True, read_only=True)
    # Las combinaciones en el detalle son read_only
    combinaciones = CombinacionProductoSerializer(many=True, read_only=True)

    class Meta(ProductoSerializer.Meta):
        # Hereda campos de ProductoSerializer y añade 'imagenes' y 'combinaciones'
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