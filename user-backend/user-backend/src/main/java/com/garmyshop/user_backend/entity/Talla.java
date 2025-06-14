package com.garmyshop.user_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "talla")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Talla {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "nombre", length = 20, nullable = false)
    private String nombre;


}
