package com.garmyshop.user_backend.repository;

import com.garmyshop.user_backend.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

    Optional<Categoria> findBySlug(String slug);
    List<Categoria> findByActivoTrue();
}