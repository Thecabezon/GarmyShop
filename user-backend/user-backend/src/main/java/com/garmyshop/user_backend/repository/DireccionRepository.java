package com.garmyshop.user_backend.repository;

import com.garmyshop.user_backend.entity.AuthUser;
import com.garmyshop.user_backend.entity.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DireccionRepository extends JpaRepository<Direccion, Integer> {

    List<Direccion> findByUsuario(AuthUser usuario);

}