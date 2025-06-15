package com.garmyshop.user_backend.model.enums; // O el paquete que elijas

public enum EstadoOrden {
    PENDIENTE("pendiente"),
    ENVIADO("enviado"),
    ENTREGADO("entregado"),
    CANCELADO("cancelado");

    private final String valor;

    EstadoOrden(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }

    // Opcional: método para convertir desde el String de la BD al Enum
    public static EstadoOrden fromValor(String valor) {
        for (EstadoOrden estado : values()) {
            if (estado.valor.equalsIgnoreCase(valor)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Valor de estado de orden desconocido: " + valor);
    }
}