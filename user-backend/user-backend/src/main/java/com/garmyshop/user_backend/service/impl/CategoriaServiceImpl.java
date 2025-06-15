package com.garmyshop.user_backend.service.impl;

import com.garmyshop.user_backend.dto.CategoriaDTO;
import com.garmyshop.user_backend.entity.Categoria;
import com.garmyshop.user_backend.repository.CategoriaRepository;
import com.garmyshop.user_backend.service.CategoriaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Para métodos de solo lectura

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service // Marca esta clase como un componente de servicio de Spring
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;

    // Inyección de dependencias vía constructor (recomendado)
    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    // Método de mapeo manual de Entidad a DTO
    // (Más adelante podríamos usar MapStruct para esto si hay muchos DTOs/Entidades)
    private CategoriaDTO convertirACategoriaDTO(Categoria categoria) {
        if (categoria == null) {
            return null;
        }
        return new CategoriaDTO(
                categoria.getId(),
                categoria.getNombre(),
                categoria.getSlug(),
                categoria.getImagen()
        );
    }

    @Override
    @Transactional(readOnly = true) // Buena práctica para métodos de solo lectura
    public List<CategoriaDTO> obtenerTodasLasCategoriasActivas() {
        // El repositorio no tiene un método directo para "activas", así que filtramos aquí.
        // O podríamos añadir un método findByActivoTrue() al repositorio.
        return categoriaRepository.findByActivoTrue() // Obtiene todas
                .stream()
                .map(this::convertirACategoriaDTO) // Mapea a DTO
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CategoriaDTO> obtenerCategoriaActivaPorSlug(String slug) {
        return categoriaRepository.findBySlug(slug) // Busca por slug
                .filter(Categoria::getActivo) // Filtra si está activa
                .map(this::convertirACategoriaDTO); // Mapea a DTO si presente y activa
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CategoriaDTO> obtenerCategoriaPorId(Integer id) {
        return categoriaRepository.findById(id) // Busca por ID
                .map(this::convertirACategoriaDTO); // Mapea a DTO si está presente
    }
}