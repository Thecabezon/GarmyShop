package com.garmyshop.user_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.garmyshop.user_backend.entity.Categoria;
import com.garmyshop.user_backend.entity.Marca;
import com.garmyshop.user_backend.entity.Producto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findByCategoria(Categoria categoria);
    Optional<Producto> findBySlug(String slug);
    
    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    List<Producto> findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(String terminoNombre, String terminoDescripcion);

    List<Producto> findByEsDestacadoTrueAndActivoTrue();

    Page<Producto> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);

    Page<Producto> findByActivoTrue(Pageable pageable);
    Page<Producto> findByCategoriaAndActivoTrue(Categoria categoria, Pageable pageable);
    Page<Producto> findByMarcaAndActivoTrue(Marca marca, Pageable pageable);
    
    @Query("SELECT DISTINCT p FROM Producto p " +
       "LEFT JOIN p.combinaciones cp " +
       "LEFT JOIN cp.color c " +
       "WHERE p.activo = true " +
       "AND (:terminoProd = '' OR :terminoProd IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :terminoProd, '%')) OR LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :terminoProd, '%'))) " +
       "AND (:nombreCol IS NULL OR LOWER(c.nombre) = LOWER(:nombreCol))")
    Page<Producto> buscarAvanzado(@Param("terminoProd") String terminoProd, @Param("nombreCol") String nombreCol, Pageable pageable);
}
