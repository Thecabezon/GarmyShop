package com.garmyshop.user_backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
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
    private Long id;

    @Column(length = 100, nullable = false)
    private String nombre;

    @Column(length = 100, unique = true, nullable = false)
    private String slug;

    private String imagen;

    private Boolean activo= true;

    @CreationTimestamp
    private LocalDateTime creado;

    @UpdateTimestamp
    private LocalDateTime actualizado;

}
