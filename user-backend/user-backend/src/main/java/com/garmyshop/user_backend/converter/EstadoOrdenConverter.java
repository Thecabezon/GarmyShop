package com.garmyshop.user_backend.converter; // O el paquete que elijas

import com.garmyshop.user_backend.model.enums.EstadoOrden;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true) // autoApply = true hace que se aplique a todos los atributos de tipo EstadoOrden
public class EstadoOrdenConverter implements AttributeConverter<EstadoOrden, String> {

    @Override
    public String convertToDatabaseColumn(EstadoOrden attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValorEnDb(); // Guarda el valor en minúscula
    }

    @Override
    public EstadoOrden convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return EstadoOrden.fromValorEnDb(dbData); // Convierte desde el valor en minúscula
    }
}