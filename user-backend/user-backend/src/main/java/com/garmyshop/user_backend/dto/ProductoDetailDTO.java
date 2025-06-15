package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDetailDTO {
    private Integer id;
    private String nombre;
    private String slug;
    private String descripcion;
    private String sku; // SKU base del producto
    private MarcaDTO marca;         // DTO completo de la marca
    private CategoriaDTO categoria; // DTO completo de la categoría
    private BigDecimal precio;
    private BigDecimal precioOferta;
    private Boolean esDestacado;
    // No incluimos 'activo' aquí, ya que el servicio solo devolverá productos activos.
    // Los campos 'creado' y 'actualizado' de la entidad Producto tampoco suelen ser necesarios aquí.

    private List<ImagenProductoDTO> imagenes;
    private List<CombinacionProductoDTO> combinacionesDisponibles; // Lista de variantes
}