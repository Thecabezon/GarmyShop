package com.garmyshop.user_backend.repository;

import com.garmyshop.user_backend.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

}
