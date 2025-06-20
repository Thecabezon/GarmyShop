package com.garmyshop.user_backend.model.enums;

public enum MetodoPago {
    TARJETA_CREDITO("Tarjeta de Crédito"), // Ejemplo
    TARJETA_DEBITO("Tarjeta de Débito"),  // Ejemplo
    MERCADO_PAGO("Mercado Pago"),          // El que nos interesa
    TRANSFERENCIA_BANCARIA("Transferencia Bancaria"), // Ejemplo
    EFECTIVO_CONTRA_ENTREGA("Efectivo Contra Entrega"); // Ejemplo, si aplica

    private final String descripcion;

    MetodoPago(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    // Opcional: si necesitas que el valor almacenado en la BD o enviado en JSON sea diferente
    // al nombre del miembro del enum, pero para @Enumerated(EnumType.STRING) y la mayoría de los
    // usos de Jackson con Enums, el nombre del miembro (TARJETA_CREDITO) es lo que se usa.
    // Si quieres que el JSON envíe "MERCADO_PAGO" y se mapee al enum MERCADO_PAGO,
    // no necesitas lógica adicional en el enum si usas el nombre del miembro.
}