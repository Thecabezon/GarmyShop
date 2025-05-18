package com.garmyshop.user_backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "imagen_producto")
@Getter
@Setter
@NoArgsConstructor
public class ImagenProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Producto producto;

    private String imagen;

    private Boolean esPrincipal = false;

    private Integer orden = 0;

    @CreationTimestamp
    private LocalDateTime creado;

    @UpdateTimestamp
    private LocalDateTime actualizado;

}
