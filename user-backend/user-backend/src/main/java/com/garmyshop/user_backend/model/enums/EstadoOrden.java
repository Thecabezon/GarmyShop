package com.garmyshop.user_backend.model.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum EstadoOrden {
    PENDIENTE("pendiente"),
    ENVIADO("enviado"),
    ENTREGADO("entregado"),
    CANCELADO("cancelado");

    private final String valorEnDb;

    EstadoOrden(String valorEnDb) {
        this.valorEnDb = valorEnDb;
    }
    @JsonValue
    public String getValorEnDb() {
        return valorEnDb;
    }

    public static EstadoOrden fromValorEnDb(String valor) {
        if (valor == null) return null;
        for (EstadoOrden e : values()) {
            if (e.valorEnDb.equalsIgnoreCase(valor)) {
                return e;
            }
        }
        throw new IllegalArgumentException("Valor desconocido para EstadoOrden: " + valor);
    }
}