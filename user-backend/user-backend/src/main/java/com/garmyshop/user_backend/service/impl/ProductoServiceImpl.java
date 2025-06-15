package com.garmyshop.user_backend.service.impl; // O com.garmyshop.user_backend.service

import com.garmyshop.user_backend.dto.*; // Importa todos tus DTOs
import com.garmyshop.user_backend.entity.*; // Importa todas tus entidades
import com.garmyshop.user_backend.repository.*; // Importa tus repositorios
import com.garmyshop.user_backend.service.ProductoService;
// Importa MapStruct si decides usarlo más adelante
// import com.garmyshop.user_backend.mapper.ProductoMapper;
// import com.garmyshop.user_backend.mapper.CategoriaMapper;
// import com.garmyshop.user_backend.mapper.MarcaMapper;
// etc.

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository; // Necesario para buscar por categoría
    private final MarcaRepository marcaRepository;       // Necesario para buscar por marca
    private final ColorRepository colorRepository;         // Potencialmente para la búsqueda por color
    // Si fuéramos a usar MapStruct, lo inyectaríamos aquí:
    // private final ProductoMapper productoMapper;

    public ProductoServiceImpl(ProductoRepository productoRepository,
                               CategoriaRepository categoriaRepository,
                               MarcaRepository marcaRepository,
                               ColorRepository colorRepository
                               /* ProductoMapper productoMapper */) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.marcaRepository = marcaRepository;
        this.colorRepository = colorRepository;
        // this.productoMapper = productoMapper;
    }

    // --- Métodos de Mapeo Manual (Helpers Privados) ---
    // (Estos podrían ser reemplazados por MapStruct en el futuro)

    private ProductoListDTO convertirAProductoListDTO(Producto producto) {
        if (producto == null) return null;

        String imagenPrincipalUrl = producto.getImagenes().stream()
                .filter(ImagenProducto::getEsPrincipal)
                .map(ImagenProducto::getImagen)
                .findFirst()
                .orElse(producto.getImagenes().isEmpty() ? null : producto.getImagenes().get(0).getImagen()); // Fallback a la primera imagen si no hay principal

        return new ProductoListDTO(
                producto.getId(),
                producto.getNombre(),
                producto.getSlug(),
                imagenPrincipalUrl,
                producto.getPrecio(),
                producto.getPrecioOferta(),
                producto.getMarca() != null ? producto.getMarca().getNombre() : null,
                producto.getCategoria() != null ? producto.getCategoria().getNombre() : null
        );
    }

    private ProductoDetailDTO convertirAProductoDetailDTO(Producto producto) {
        if (producto == null) return null;

        // Mapeo de Marca a MarcaDTO
        MarcaDTO marcaDTO = null;
        if (producto.getMarca() != null) {
            Marca marca = producto.getMarca();
            marcaDTO = new MarcaDTO(marca.getId(), marca.getNombre(), marca.getSlug(), marca.getImagen());
        }

        // Mapeo de Categoria a CategoriaDTO
        CategoriaDTO categoriaDTO = null;
        if (producto.getCategoria() != null) {
            Categoria categoria = producto.getCategoria();
            categoriaDTO = new CategoriaDTO(categoria.getId(), categoria.getNombre(), categoria.getSlug(), categoria.getImagen());
        }

        // Mapeo de List<ImagenProducto> a List<ImagenProductoDTO>
        List<ImagenProductoDTO> imagenesDTO = producto.getImagenes().stream()
                .map(img -> new ImagenProductoDTO(img.getId(), img.getImagen(), img.getEsPrincipal(), img.getOrden()))
                .collect(Collectors.toList());

        // Mapeo de List<CombinacionProducto> a List<CombinacionProductoDTO>
        List<CombinacionProductoDTO> combinacionesDTO = producto.getCombinaciones().stream()
                .filter(cp -> cp.getStock() > 0) // Solo mostrar combinaciones con stock
                .map(cp -> new CombinacionProductoDTO(
                        cp.getId(),
                        new TallaDTO(cp.getTalla().getId(), cp.getTalla().getNombre()),
                        new ColorDTO(cp.getColor().getId(), cp.getColor().getNombre(), cp.getColor().getCodigoHex()),
                        cp.getStock(),
                        cp.getSku()
                ))
                .collect(Collectors.toList());

        return new ProductoDetailDTO(
                producto.getId(),
                producto.getNombre(),
                producto.getSlug(),
                producto.getDescripcion(),
                producto.getSku(),
                marcaDTO,
                categoriaDTO,
                producto.getPrecio(),
                producto.getPrecioOferta(),
                producto.getEsDestacado(),
                imagenesDTO,
                combinacionesDTO
        );
    }

    // --- Implementación de los métodos del servicio ---

    @Override
    @Transactional(readOnly = true)
    public Page<ProductoListDTO> obtenerTodosLosProductosActivos(Pageable pageable) {
        // Asumimos que el repositorio puede tener un método para buscar activos directamente
        // o que filtramos después. Por ahora, un método simple:
        // Si no tienes un findByActivoTrue en ProductoRepository, puedes filtrar aquí.
        // Page<Producto> productosPage = productoRepository.findByActivoTrue(pageable); // Si existiera
        // Para filtrar por activo si el repositorio no lo hace:
        // List<ProductoListDTO> dtoList = productosPage.getContent().stream()
        //        .filter(Producto::getActivo) // Asegúrate que la entidad Producto tenga getActivo()
        //        .map(this::convertirAProductoListDTO)
        //        .collect(Collectors.toList());
        // return new PageImpl<>(dtoList, pageable, productosPage.getTotalElements()); // Si filtras manualmente
        // Por ahora, asumimos que todos los productos del repositorio findAll son potencialmente mostrables
        // y el filtrado por activo debería estar en la query del repositorio.
        // **ACCIÓN REQUERIDA: Añadir findByActivoTrue(Pageable pageable) a ProductoRepository**

        // **Añade a ProductoRepository.java:**
        // Page<Producto> findByActivoTrue(Pageable pageable);

        // Luego usa:
        return productoRepository.findByActivoTrue(pageable) // Asumiendo que añades este método al repo
                .map(this::convertirAProductoListDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductoDetailDTO> obtenerProductoActivoPorSlug(String slug) {
        return productoRepository.findBySlug(slug)
                .filter(Producto::getActivo) // Asegúrate que la entidad Producto tenga getActivo()
                .map(this::convertirAProductoDetailDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductoDetailDTO> obtenerProductoActivoPorId(Integer id) {
        return productoRepository.findById(id)
                .filter(Producto::getActivo) // Asegúrate que la entidad Producto tenga getActivo()
                .map(this::convertirAProductoDetailDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductoListDTO> obtenerProductosActivosPorCategoria(Integer categoriaId, Pageable pageable) {
        // Primero verificamos si la categoría existe y está activa
        Optional<Categoria> categoriaOpt = categoriaRepository.findById(categoriaId);
        if (categoriaOpt.isEmpty() || !categoriaOpt.get().getActivo()) {
            return Page.empty(pageable); // Devuelve una página vacía si la categoría no es válida
        }
        // **ACCIÓN REQUERIDA: Añadir findByCategoriaAndActivoTrue(Categoria categoria, Pageable pageable) a ProductoRepository**

        // **Añade a ProductoRepository.java:**
        // Page<Producto> findByCategoriaAndActivoTrue(Categoria categoria, Pageable pageable);

        // Luego usa:
        return productoRepository.findByCategoriaAndActivoTrue(categoriaOpt.get(), pageable)
                .map(this::convertirAProductoListDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductoListDTO> obtenerProductosActivosPorMarca(Integer marcaId, Pageable pageable) {
        Optional<Marca> marcaOpt = marcaRepository.findById(marcaId);
        if (marcaOpt.isEmpty() || !marcaOpt.get().getActivo()) {
            return Page.empty(pageable);
        }
        // **ACCIÓN REQUERIDA: Añadir findByMarcaAndActivoTrue(Marca marca, Pageable pageable) a ProductoRepository**

        // **Añade a ProductoRepository.java:**
        // Page<Producto> findByMarcaAndActivoTrue(Marca marca, Pageable pageable);

        // Luego usa:
        return productoRepository.findByMarcaAndActivoTrue(marcaOpt.get(), pageable)
                .map(this::convertirAProductoListDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductoListDTO> buscarProductos(String terminoBusqueda, Pageable pageable) {
        // Aquí es donde implementaríamos la lógica de parseo de "polo rojo"
        // y usaríamos la query @Query("SELECT DISTINCT p FROM Producto p ...") que discutimos.

        // Lógica de parseo simplificada (debe mejorarse mucho):
        String terminoProducto = terminoBusqueda;
        String nombreColor = null;

        // Ejemplo muy básico de extracción de color (esto necesita ser más robusto)
        // Podrías tener una lista de colores conocidos del colorRepository.findAll()
        List<String> coloresConocidos = colorRepository.findAll().stream().map(Color::getNombre).collect(Collectors.toList());
        for (String colorConocido : coloresConocidos) {
            if (terminoBusqueda.toLowerCase().contains(colorConocido.toLowerCase())) {
                nombreColor = colorConocido;
                // Remover el color del término de búsqueda del producto (esto es un ejemplo simple)
                terminoProducto = terminoBusqueda.toLowerCase().replace(colorConocido.toLowerCase(), "").trim();
                break;
            }
        }
        if (terminoProducto.isEmpty() && nombreColor == null) { // Si después del parseo no queda nada
             return Page.empty(pageable); // O buscar todos si el término original estaba vacío.
        }


        // **ACCIÓN REQUERIDA: Añadir la query @Query buscarAvanzado(...) a ProductoRepository**
        // que discutimos anteriormente.
        // @Query("SELECT DISTINCT p FROM Producto p " +
        //        "LEFT JOIN p.combinaciones cp " +
        //        "LEFT JOIN cp.color c " +
        //        "WHERE p.activo = true " +
        //        "AND (:terminoProd = '' OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :terminoProd, '%')) OR LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :terminoProd, '%'))) " +
        //        "AND (:nombreCol IS NULL OR LOWER(c.nombre) = LOWER(:nombreCol))")
        // Page<Producto> buscarAvanzado(@Param("terminoProd") String terminoProd, @Param("nombreCol") String nombreCol, Pageable pageable);

        // Luego usa:
        return productoRepository.buscarAvanzado(terminoProducto, nombreColor, pageable)
               .map(this::convertirAProductoListDTO);
    }
}