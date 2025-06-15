package com.garmyshop.user_backend.service.impl; // o .service

import com.garmyshop.user_backend.dto.ColorDTO;
import com.garmyshop.user_backend.entity.Color;
import com.garmyshop.user_backend.repository.ColorRepository;
import com.garmyshop.user_backend.service.ColorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ColorServiceImpl implements ColorService {

    private final ColorRepository colorRepository;

    public ColorServiceImpl(ColorRepository colorRepository) {
        this.colorRepository = colorRepository;
    }

    private ColorDTO convertirAColorDTO(Color color) {
        if (color == null) return null;
        return new ColorDTO(
                color.getId(),
                color.getNombre(),
                color.getCodigoHex()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ColorDTO> obtenerTodosLosColores() {
        return colorRepository.findAll() // La entidad Color no tiene 'activo', así que traemos todos
                .stream()
                .map(this::convertirAColorDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ColorDTO> obtenerColorPorId(Integer id) {
        return colorRepository.findById(id)
                .map(this::convertirAColorDTO);
    }
}