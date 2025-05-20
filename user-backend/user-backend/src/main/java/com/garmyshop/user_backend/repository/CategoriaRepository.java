package com.garmyshop.user_backend.repository;

import com.garmyshop.user_backend.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    Optional<Categoria> findBySlug(String id);
}
