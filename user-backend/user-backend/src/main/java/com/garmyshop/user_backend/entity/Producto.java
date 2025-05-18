package com.garmyshop.user_backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
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
    private Long id;

    @Column(length = 200, nullable = false)
    private String nombre;

    @Column(length = 200, unique = true, nullable = false)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 50, unique = true, nullable = false)
    private String sku;

    @ManyToOne
    @JoinColumn(name = "marca_id", nullable = false)
    private Marca marca;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal precio;

    @Column(precision = 10, scale = 2)
    private BigDecimal precioOferta;

    private Boolean activo = true;

    private Boolean esDestacado = false;

    @CreationTimestamp
    private LocalDateTime creado;

    @UpdateTimestamp
    private LocalDateTime actualizado;

}
