package com.garmyshop.user_backend.config;

import com.garmyshop.user_backend.entity.Categoria;
import com.garmyshop.user_backend.entity.Marca;
import com.garmyshop.user_backend.entity.Producto;
import com.garmyshop.user_backend.repository.CategoriaRepository;
import com.garmyshop.user_backend.repository.MarcaRepository;
import com.garmyshop.user_backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

//@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private MarcaRepository marcaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public void run(String... args) throws Exception {
        // Crear algunas categorías de prueba
        Categoria categoria1 = new Categoria();
        categoria1.setNombre("Camisetas");
        categoria1.setSlug("camisetas");
        categoria1.setImagen("https://ejemplo.com/imagenes/camisetas.jpg");
        categoriaRepository.save(categoria1);

        Categoria categoria2 = new Categoria();
        categoria2.setNombre("Pantalones");
        categoria2.setSlug("pantalones");
        categoria2.setImagen("https://ejemplo.com/imagenes/pantalones.jpg");
        categoriaRepository.save(categoria2);

        // Crear algunas marcas de prueba
        Marca marca1 = new Marca();
        marca1.setNombre("Nike");
        marca1.setSlug("nike");
        marca1.setImagen("https://ejemplo.com/imagenes/nike.jpg");
        marcaRepository.save(marca1);

        Marca marca2 = new Marca();
        marca2.setNombre("Adidas");
        marca2.setSlug("adidas");
        marca2.setImagen("https://ejemplo.com/imagenes/adidas.jpg");
        marcaRepository.save(marca2);

        // Crear algunos productos de prueba
        Producto producto1 = new Producto();
        producto1.setNombre("Camiseta Nike Dry-FIT");
        producto1.setSlug("camiseta-nike-dry-fit");
        producto1.setDescripcion("Camiseta deportiva de alto rendimiento");
        producto1.setSku("CN1234");
        producto1.setMarca(marca1);
        producto1.setCategoria(categoria1);
        producto1.setPrecio(new BigDecimal("29.99"));
        productoRepository.save(producto1);

        Producto producto2 = new Producto();
        producto2.setNombre("Pantalon Adidas Tiro");
        producto2.setSlug("pantalon-adidas-tiro");
        producto2.setDescripcion("Pantalon de entrenamiento para futbol");
        producto2.setSku("AD5678");
        producto2.setMarca(marca2);
        producto2.setCategoria(categoria2);
        producto2.setPrecio(new BigDecimal("39.99"));
        productoRepository.save(producto2);

        // Puedes crear más productos, imágenes, tallas, colores, etc.
    }
}