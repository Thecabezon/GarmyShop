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
    private String sku;
    private MarcaDTO marca;
    private CategoriaDTO categoria;
    private BigDecimal precio;
    private BigDecimal precioOferta;
    private Boolean esDestacado;

    private List<ImagenProductoDTO> imagenes;
    private List<CombinacionProductoDTO> combinacionesDisponibles;
}