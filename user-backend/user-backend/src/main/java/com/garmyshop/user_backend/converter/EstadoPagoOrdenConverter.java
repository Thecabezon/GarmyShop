package com.garmyshop.user_backend.converter;

import com.garmyshop.user_backend.model.enums.EstadoPagoOrden;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoPagoOrdenConverter implements AttributeConverter<EstadoPagoOrden, String> {

    @Override
    public String convertToDatabaseColumn(EstadoPagoOrden attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValorEnDb(); // Guarda el valor en minúscula
    }

    @Override
    public EstadoPagoOrden convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return EstadoPagoOrden.fromValorEnDb(dbData); // Convierte desde el valor en minúscula
    }
}