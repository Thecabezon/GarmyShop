package com.garmyshop.user_backend.converter;

import com.garmyshop.user_backend.model.enums.EstadoOrden;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoOrdenConverter implements AttributeConverter<EstadoOrden, String> {

    @Override
    public String convertToDatabaseColumn(EstadoOrden attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValorEnDb();
    }

    @Override
    public EstadoOrden convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return EstadoOrden.fromValorEnDb(dbData);
    }
}