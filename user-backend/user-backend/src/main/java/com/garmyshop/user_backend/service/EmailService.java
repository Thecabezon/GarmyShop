package com.garmyshop.user_backend.service;

public interface EmailService {

    /**
     * Envía un email para el reseteo de contraseña.
     * @param destinatarioEmail
     * @param nombreUsuario
     * @param token
     * @param frontendResetUrl
     */
    void enviarEmailReseteoPassword(String destinatarioEmail, String nombreUsuario, String token, String frontendResetUrl);

}