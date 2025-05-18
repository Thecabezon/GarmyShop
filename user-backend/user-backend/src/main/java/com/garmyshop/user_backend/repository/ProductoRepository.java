package com.garmyshop.user_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.garmyshop.user_backend.entity.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

}
