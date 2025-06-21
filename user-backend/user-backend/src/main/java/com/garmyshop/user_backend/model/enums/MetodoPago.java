package com.garmyshop.user_backend.model.enums;

import com.fasterxml.jackson.annotation.JsonValue; // Para la serialización JSON

public enum MetodoPago {
    TARJETA_CREDITO("tarjeta_credito"), // Valores en minúscula para la BD y JSON
    TARJETA_DEBITO("tarjeta_debito"),
    MERCADO_PAGO("mercado_pago"),
    TRANSFERENCIA_BANCARIA("transferencia_bancaria"),
    EFECTIVO_CONTRA_ENTREGA("efectivo_contra_entrega");

    private final String valorEnDb;

    MetodoPago(String valorEnDb) {
        this.valorEnDb = valorEnDb;
    }

    @JsonValue // Le dice a Jackson que use este método para convertir el Enum a JSON
    public String getValorEnDb() {
        return valorEnDb;
    }

    // Método para encontrar el Enum a partir del valor de la BD (o JSON si se configura)
    // Jackson por defecto intentará hacer Enum.valueOf(stringEnMayusculas) para deserializar.
    // Si quieres que el JSON de entrada también sea en minúsculas, necesitarías @JsonCreator o un deserializador personalizado.
    // Por ahora, asumamos que el JSON de entrada para el requestDTO enviará "MERCADO_PAGO" (mayúsculas).
    public static MetodoPago fromValorEnDb(String valor) {
        if (valor == null) {
            return null;
        }
        for (MetodoPago mp : values()) {
            if (mp.valorEnDb.equalsIgnoreCase(valor)) {
                return mp;
            }
        }
        // Si el JSON de entrada envía el nombre del enum (ej. "MERCADO_PAGO"), también lo manejamos
        try {
            return MetodoPago.valueOf(valor.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Valor desconocido para MetodoPago: " + valor);
        }
    }
}