from django.db import models
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField

User = get_user_model()
# Modelo para representar las categorías de productos 
class Categoria(models.Model):
    nombre = models.CharField(max_length=100, verbose_name="Nombre")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="Slug")
    # Sintaxis correcta para CloudinaryField
    imagen = CloudinaryField(
        folder='categorias',
        null=True,
        blank=True,
        verbose_name="Imagen",
    )
    activo = models.BooleanField(default=True, verbose_name="Activo")
    creado = models.DateTimeField(auto_now_add=True, verbose_name="Creado")
    actualizado = models.DateTimeField(auto_now=True, verbose_name="Actualizado")

    class Meta:
        db_table = 'categoria'  # <--- Así la tabla se llamará 'categoria'
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre
    
# Modelo para representar las marcas de productos
class Marca(models.Model):
    nombre = models.CharField(max_length=100, verbose_name="Nombre")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="Slug")
    # Sintaxis correcta para CloudinaryField
    imagen = CloudinaryField(
        folder='marcas',
        null=True,
        blank=True,
        verbose_name="Imagen",
    )
    activo = models.BooleanField(default=True, verbose_name="Activo")
    creado = models.DateTimeField(auto_now_add=True, verbose_name="Creado")
    actualizado = models.DateTimeField(auto_now=True, verbose_name="Actualizado")

    class Meta:
        db_table = 'marca'  # Así la tabla se llamará 'marca'
        verbose_name = "Marca"
        verbose_name_plural = "Marcas"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre 


class Talla(models.Model):
    nombre = models.CharField(max_length=20, verbose_name="Talla")

    class Meta:
        db_table = 'talla'
        verbose_name = "Talla"
        verbose_name_plural = "Tallas"

    def __str__(self):
        return self.nombre
    

class Color(models.Model):
    nombre = models.CharField(max_length=30, verbose_name="Color")
    codigo_hex = models.CharField(max_length=7, null=True, blank=True, verbose_name="Código HEX")

    class Meta:
        db_table = 'color'
        verbose_name = "Color"
        verbose_name_plural = "Colores"

    def __str__(self):
        return self.nombre
    
       
class Producto(models.Model):
    nombre = models.CharField(max_length=200, verbose_name="Nombre")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")
    descripcion = models.TextField(verbose_name="Descripción")
    sku = models.CharField(max_length=50, unique=True, verbose_name="SKU")
    marca = models.ForeignKey('Marca', on_delete=models.CASCADE, verbose_name="Marca")
    categoria = models.ForeignKey('Categoria', on_delete=models.CASCADE, verbose_name="Categoría")
    precio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio")
    precio_oferta = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Precio en Oferta")
    activo = models.BooleanField(default=True, verbose_name="Activo")
    es_destacado = models.BooleanField(default=False, verbose_name="Es Destacado")
    creado = models.DateTimeField(auto_now_add=True, verbose_name="Creado")
    actualizado = models.DateTimeField(auto_now=True, verbose_name="Actualizado")

    class Meta:
        db_table = 'producto'
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

    @property
    def imagen_principal(self):
        return self.imagenes.filter(es_principal=True).first()
    
    
# Modelo para representar imágenes de productos
class ImagenProducto(models.Model):
    producto = models.ForeignKey(
        'Producto',
        on_delete=models.CASCADE,
        related_name='imagenes',
        verbose_name="Producto"
    )
    # Sintaxis correcta para CloudinaryField
    imagen = CloudinaryField(
        folder='productos',
        verbose_name="Imagen",
    )
    es_principal = models.BooleanField(default=False, verbose_name="¿Es imagen principal?")
    orden = models.IntegerField(default=0, verbose_name="Orden")
    creado = models.DateTimeField(auto_now_add=True, verbose_name="Creado")
    actualizado = models.DateTimeField(auto_now=True, verbose_name="Actualizado")

    class Meta:
        db_table = 'imagen_producto'
        verbose_name = "Imagen de Producto"
        verbose_name_plural = "Imágenes de Productos"
        ordering = ['orden', 'creado']

    def __str__(self):
        return f"Imagen de {self.producto.nombre}"
    

class CombinacionProducto(models.Model):
    producto = models.ForeignKey(
        'Producto',
        on_delete=models.CASCADE,
        related_name='combinaciones',
        verbose_name="Producto"
    )
    talla = models.ForeignKey(
        'Talla',
        on_delete=models.CASCADE,
        verbose_name="Talla"
    )
    color = models.ForeignKey(
        'Color',
        on_delete=models.CASCADE,
        verbose_name="Color"
    )
    stock = models.PositiveIntegerField(default=0, verbose_name="Stock")
    sku = models.CharField(max_length=50, unique=True, verbose_name="SKU de Combinación")

    class Meta:
        db_table = 'combinacion_producto'
        unique_together = ('producto', 'talla', 'color')
        verbose_name = "Combinación de Producto"
        verbose_name_plural = "Combinaciones de Producto"

    def __str__(self):
        return f"{self.producto.nombre} - {self.talla.nombre} - {self.color.nombre}"
    
    
    
class Direccion(models.Model):
    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='direcciones',
        verbose_name="Usuario"
    )
    nombre = models.CharField(max_length=100, verbose_name="Nombre")
    apellido = models.CharField(max_length=100, verbose_name="Apellido")
    departamento = models.CharField(max_length=100, verbose_name="Departamento")
    provincia = models.CharField(max_length=100, verbose_name="Provincia")
    distrito = models.CharField(max_length=100, verbose_name="Distrito")
    calle = models.CharField(max_length=255, verbose_name="Calle y número")
    codigo_postal = models.CharField(max_length=20, verbose_name="Código Postal")
    referencia = models.CharField(max_length=255, null=True, blank=True, verbose_name="Referencia")
    telefono = models.CharField(max_length=20, verbose_name="Teléfono de contacto")
    creado = models.DateTimeField(auto_now_add=True, verbose_name="Creado")
    actualizado = models.DateTimeField(auto_now=True, verbose_name="Actualizado")

    class Meta:
        db_table = 'direccion'
        verbose_name = "Dirección"
        verbose_name_plural = "Direcciones"
        ordering = ['-creado']

    def __str__(self):
        return f"{self.nombre} {self.apellido} - {self.calle}, {self.distrito}, {self.provincia}, {self.departamento}"
    
    

class Orden(models.Model):
    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Usuario"
    )
    direccion_envio = models.ForeignKey(
        'Direccion',
        on_delete=models.PROTECT,
        verbose_name="Dirección de Envío"
    )
    total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Total")
    metodo_pago = models.CharField(max_length=50, verbose_name="Método de Pago")
    estado_pago = models.CharField(max_length=30, default='pendiente', verbose_name="Estado de Pago")
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('enviado', 'Enviado'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente', verbose_name="Estado de la Orden")
    cantidad_compra = models.IntegerField(default=0, verbose_name="Cantidad de Productos")
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Fecha de Actualización")

    class Meta:
        db_table = 'orden'
        verbose_name = "Orden"
        verbose_name_plural = "Órdenes"
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"Orden #{self.pk} de {self.usuario.username}"
         
    
    



class OrdenItem(models.Model):
    orden = models.ForeignKey(
        'Orden',
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name="Orden"
    )
    combinacion = models.ForeignKey(
        'CombinacionProducto',
        on_delete=models.PROTECT,
        verbose_name="Combinación de Producto"
    )
    cantidad = models.PositiveIntegerField(default=1, verbose_name="Cantidad")
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio Unitario")
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Subtotal")
    creado = models.DateTimeField(auto_now_add=True, verbose_name="Creado")
    actualizado = models.DateTimeField(auto_now=True, verbose_name="Actualizado")

    class Meta:
        db_table = 'orden_item'
        verbose_name = "Item de Orden"
        verbose_name_plural = "Items de Orden"
        ordering = ['-creado']

    def save(self, *args, **kwargs):
        self.subtotal = self.precio_unitario * self.cantidad
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.cantidad} x {self.combinacion} en Orden #{self.orden.pk}"