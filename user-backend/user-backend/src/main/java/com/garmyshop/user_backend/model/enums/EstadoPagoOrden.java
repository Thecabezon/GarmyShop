package com.garmyshop.user_backend.model.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum EstadoPagoOrden {
    PENDIENTE("pendiente"),
    PAGADO("pagado"),
    FALLIDO("fallido"),
    REEMBOLSADO("reembolsado");

    private final String valorEnDb;

    EstadoPagoOrden(String valorEnDb) {
        this.valorEnDb = valorEnDb;
    }

    @JsonValue
    public String getValorEnDb() {
        return valorEnDb;
    }

    public static EstadoPagoOrden fromValorEnDb(String valor) {
        if (valor == null) {
            return null;
        }
        for (EstadoPagoOrden epo : values()) {
            if (epo.valorEnDb.equalsIgnoreCase(valor)) {
                return epo;
            }
        }
        try {
            return EstadoPagoOrden.valueOf(valor.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Valor desconocido para EstadoPagoOrden: " + valor);
        }
    }
}