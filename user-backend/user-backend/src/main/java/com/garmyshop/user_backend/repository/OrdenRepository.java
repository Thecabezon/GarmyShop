package com.garmyshop.user_backend.repository;

import com.garmyshop.user_backend.entity.AuthUser;
import com.garmyshop.user_backend.entity.Orden;
import com.garmyshop.user_backend.model.enums.EstadoOrden;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrdenRepository extends JpaRepository<Orden, Integer> {

    List<Orden> findByUsuarioOrderByFechaCreacionDesc(AuthUser usuario);

    Page<Orden> findByUsuarioOrderByFechaCreacionDesc(AuthUser usuario, Pageable pageable);

    Page<Orden> findByUsuarioIdOrderByFechaCreacionDesc(Integer usuarioId, Pageable pageable);

    Page<Orden> findByUsuarioAndEstadoOrderByFechaCreacionDesc(AuthUser usuario, EstadoOrden estado, Pageable pageable);

}