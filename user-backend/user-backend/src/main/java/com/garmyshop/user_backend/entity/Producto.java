package com.garmyshop.user_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "producto")
@Getter
@Setter
@NoArgsConstructor
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre", length = 200, nullable = false)
    private String nombre;

    @Column(name = "slug", length = 200, unique = true, nullable = false)
    private String slug;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "sku", length = 50, unique = true, nullable = false)
    private String sku;

    @ManyToOne
    @JoinColumn(name = "marca_id", nullable = false)
    private Marca marca;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(name = "precio", precision = 10, scale = 2, nullable = false)
    private BigDecimal precio;

    @Column(name = "precio_oferta", precision = 10, scale = 2, nullable = true)
    private BigDecimal precioOferta;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "es_destacado", nullable = false)
    private Boolean esDestacado = false;

    @Column(name = "creado")
    private LocalDateTime creado;

    @Column(name = "actualizado")
    private LocalDateTime actualizado;

}
