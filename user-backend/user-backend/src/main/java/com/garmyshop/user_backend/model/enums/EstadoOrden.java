// En com.garmyshop.user_backend.model.enums.EstadoOrden.java
package com.garmyshop.user_backend.model.enums;

public enum EstadoOrden {
    PENDIENTE("pendiente"),
    ENVIADO("enviado"),
    ENTREGADO("entregado"),
    CANCELADO("cancelado");

    private final String valorEnDb;

    EstadoOrden(String valorEnDb) {
        this.valorEnDb = valorEnDb;
    }

    public String getValorEnDb() {
        return valorEnDb;
    }

    // Método para encontrar el Enum a partir del valor de la BD
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