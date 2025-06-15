package com.garmyshop.user_backend.model.enums;

public enum EstadoPagoOrden {
    PENDIENTE("pendiente"),
    PAGADO("pagado"),
    FALLIDO("fallido"),
    REEMBOLSADO("reembolsado");

    private final String valor;

    EstadoPagoOrden(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }

    public static EstadoPagoOrden fromValor(String valor) {
        for (EstadoPagoOrden estado : values()) {
            if (estado.valor.equalsIgnoreCase(valor)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Valor de estado de pago de orden desconocido: " + valor);
    }
}