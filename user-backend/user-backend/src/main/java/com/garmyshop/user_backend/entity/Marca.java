package com.garmyshop.user_backend.entity;

import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;



@Entity
@Table(name = "marca")
@Getter
@Setter
@NoArgsConstructor
public class Marca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre", length = 100, nullable = false)
    private String nombre;

    @Column(name = "slug", length = 100, unique = true, nullable = false)
    private String slug;

    @Column(name = "imagen", nullable = false)
    private String imagen;

    @Column(name = "activo", nullable = false)
    private Boolean activo= true;

    @Column(name = "creado")
    private LocalDateTime creado;

    @Column(name = "actualizado")
    private LocalDateTime actualizado;

}
