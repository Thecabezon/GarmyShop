package com.garmyshop.user_backend.service;

public interface EmailService {

    /**
     * Envía un email para el reseteo de contraseña.
     *
     * @param destinatarioEmail La dirección de email a la que se enviará el correo.
     * @param nombreUsuario El nombre del usuario (para personalizar el email).
     * @param token El token de reseteo de contraseña.
     * @param frontendResetUrl La URL base del frontend para la página de reseteo (ej. "http://localhost:3000/reset-password")
     */
    void enviarEmailReseteoPassword(String destinatarioEmail, String nombreUsuario, String token, String frontendResetUrl);

    // Podrías añadir otros métodos de email aquí en el futuro, como:
    // - enviarEmailConfirmacionRegistro(String destinatarioEmail, String nombreUsuario);
    // - enviarEmailConfirmacionOrden(String destinatarioEmail, OrdenDetailDTO orden);
}