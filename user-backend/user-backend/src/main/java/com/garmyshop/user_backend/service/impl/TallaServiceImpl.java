package com.garmyshop.user_backend.service.impl; // o .service

import com.garmyshop.user_backend.dto.TallaDTO;
import com.garmyshop.user_backend.entity.Talla;
import com.garmyshop.user_backend.repository.TallaRepository;
import com.garmyshop.user_backend.service.TallaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TallaServiceImpl implements TallaService {

    private final TallaRepository tallaRepository;

    public TallaServiceImpl(TallaRepository tallaRepository) {
        this.tallaRepository = tallaRepository;
    }

    private TallaDTO convertirATallaDTO(Talla talla) {
        if (talla == null) return null;
        return new TallaDTO(
                talla.getId(),
                talla.getNombre()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<TallaDTO> obtenerTodasLasTallas() {
        return tallaRepository.findAll() // La entidad Talla no tiene 'activo', así que traemos todas
                .stream()
                .map(this::convertirATallaDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TallaDTO> obtenerTallaPorId(Integer id) {
        return tallaRepository.findById(id)
                .map(this::convertirATallaDTO);
    }
}