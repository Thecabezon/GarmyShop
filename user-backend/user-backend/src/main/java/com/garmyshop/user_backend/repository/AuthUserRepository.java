package com.garmyshop.user_backend.repository;

import com.garmyshop.user_backend.entity.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AuthUserRepository extends JpaRepository<AuthUser, Integer> {

    // Método para buscar un usuario por su nombre de usuario (username)
    // Devuelve un Optional porque el usuario podría no existir.
    Optional<AuthUser> findByUsername(String username);

    // Método para buscar un usuario por su dirección de email
    // Devuelve un Optional porque el usuario podría no existir.
    // Considera si el email debe ser único en tu sistema (sugerido).
    Optional<AuthUser> findByEmail(String email);

    // Método para verificar si un nombre de usuario ya existe (útil para el registro)
    boolean existsByUsername(String username);

    // Método para verificar si un email ya existe (útil para el registro)
    boolean existsByEmail(String email);
}