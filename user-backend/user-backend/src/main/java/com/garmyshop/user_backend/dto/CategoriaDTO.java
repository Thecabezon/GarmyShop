package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

// @Data de Lombok genera getters, setters, toString, equals, hashCode.
// Si prefieres ser más explícito, puedes usar @Getter, @Setter, etc., individualmente.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaDTO {
    private Integer id;
    private String nombre;
    private String slug;
    private String imagen; // URL de la imagen
    // No incluimos 'activo', 'creado', 'actualizado' en el DTO para el usuario final
    // a menos que sea específicamente necesario. Para listar categorías,
    // el servicio ya las filtrará por activas.
}