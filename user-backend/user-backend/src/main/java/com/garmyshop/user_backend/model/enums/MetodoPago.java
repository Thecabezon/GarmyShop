package com.garmyshop.user_backend.model.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum MetodoPago {
    TARJETA_CREDITO("tarjeta_credito"),
    TARJETA_DEBITO("tarjeta_debito"),
    STRIPE_CHECKOUT("stripe_checkout"),
    TRANSFERENCIA_BANCARIA("transferencia_bancaria"),
    EFECTIVO_CONTRA_ENTREGA("efectivo_contra_entrega");

    private final String valorEnDb;

    MetodoPago(String valorEnDb) {
        this.valorEnDb = valorEnDb;
    }

    @JsonValue
    public String getValorEnDb() {
        return valorEnDb;
    }

    public static MetodoPago fromValorEnDb(String valor) {
        if (valor == null) {
            return null;
        }
        for (MetodoPago mp : values()) {
            if (mp.valorEnDb.equalsIgnoreCase(valor)) {
                return mp;
            }
        }
        try {
            return MetodoPago.valueOf(valor.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Valor desconocido para MetodoPago: " + valor);
        }
    }
}