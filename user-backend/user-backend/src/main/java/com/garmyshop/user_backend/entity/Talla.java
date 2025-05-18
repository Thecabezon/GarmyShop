package com.garmyshop.user_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "talla")
@Getter
@Setter
@NoArgsConstructor
public class Talla {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20, nullable = false)
    private String nombre;


}
