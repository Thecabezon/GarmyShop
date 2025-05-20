package com.garmyshop.user_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.garmyshop.user_backend.entity.Categoria;
import com.garmyshop.user_backend.entity.Producto;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByCategoria(Categoria categoria);

}
