package com.garmyshop.user_backend.repository;

import com.garmyshop.user_backend.entity.AuthUser;
import com.garmyshop.user_backend.entity.Orden;
import com.garmyshop.user_backend.model.enums.EstadoOrden; // Asumiendo que tienes tu Enum EstadoOrden
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
// import java.time.LocalDateTime; // Para búsquedas por fecha si se añaden

public interface OrdenRepository extends JpaRepository<Orden, Integer> {

    // Método para encontrar todas las órdenes de un usuario específico,
    // ordenadas por fecha de creación descendente (las más nuevas primero).
    List<Orden> findByUsuarioOrderByFechaCreacionDesc(AuthUser usuario);

    // Versión paginada del método anterior, que es más escalable si un usuario tiene muchas órdenes.
    Page<Orden> findByUsuarioOrderByFechaCreacionDesc(AuthUser usuario, Pageable pageable);

    // Alternativa pasando el ID del usuario:
    Page<Orden> findByUsuarioIdOrderByFechaCreacionDesc(Integer usuarioId, Pageable pageable);

    // Ejemplo de un método más específico que podrías necesitar en el futuro:
    // Encontrar órdenes de un usuario con un estado específico.
    Page<Orden> findByUsuarioAndEstadoOrderByFechaCreacionDesc(AuthUser usuario, EstadoOrden estado, Pageable pageable);

}