package com.garmyshop.user_backend.repository;

import com.garmyshop.user_backend.entity.Orden;
import com.garmyshop.user_backend.entity.OrdenItem;
import com.garmyshop.user_backend.entity.CombinacionProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrdenItemRepository extends JpaRepository<OrdenItem, Integer> {

    List<OrdenItem> findByOrden(Orden orden);

    List<OrdenItem> findByCombinacion(CombinacionProducto combinacion);

}