package com.garmyshop.user_backend.repository;

import com.garmyshop.user_backend.entity.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface MarcaRepository extends JpaRepository<Marca, Integer> {
    Optional<Marca> findBySlug(String slug);
    List<Marca> findByActivoTrue(); // Método para obtener marcas activas
}
