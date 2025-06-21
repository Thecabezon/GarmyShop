package com.garmyshop.user_backend.converter;

import com.garmyshop.user_backend.model.enums.MetodoPago;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class MetodoPagoConverter implements AttributeConverter<MetodoPago, String> {

    @Override
    public String convertToDatabaseColumn(MetodoPago attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValorEnDb(); // Guarda el valor en minúscula
    }

    @Override
    public MetodoPago convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return MetodoPago.fromValorEnDb(dbData); // Convierte desde el valor en minúscula
    }
}