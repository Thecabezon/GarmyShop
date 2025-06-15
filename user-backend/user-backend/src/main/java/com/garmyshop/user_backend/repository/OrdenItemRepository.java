package com.garmyshop.user_backend.repository;

import com.garmyshop.user_backend.entity.Orden;
import com.garmyshop.user_backend.entity.OrdenItem;
import com.garmyshop.user_backend.entity.CombinacionProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrdenItemRepository extends JpaRepository<OrdenItem, Integer> {

    // Método para encontrar todos los items de una orden específica.
    // Aunque ya puedes obtenerlos con orden.getItems(), tener este método
    // puede ser útil si quieres cargar los items explícitamente o
    // si tienes una instancia de Orden con items LAZY y necesitas recargarlos.
    List<OrdenItem> findByOrden(Orden orden);

    // Ejemplo de un método que podría ser útil para análisis o reportes:
    // Encontrar todos los items de orden que corresponden a una combinación de producto específica.
    // Esto podría ayudar a ver cuántas veces se ha vendido un SKU particular.
    List<OrdenItem> findByCombinacion(CombinacionProducto combinacion);


}