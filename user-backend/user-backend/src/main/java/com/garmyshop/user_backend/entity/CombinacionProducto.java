package com.garmyshop.user_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "combinacion_producto",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"producto_id", "talla_id", "color_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CombinacionProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "talla_id", nullable = false)
    private Talla talla;

    @ManyToOne
    @JoinColumn(name = "color_id", nullable = false)
    private Color color;

    @Column(name = "stock",nullable = false)
    private Integer stock = 0;

    @Column(name = "sku", length = 50, unique = true, nullable = false)
    private String sku;


}
