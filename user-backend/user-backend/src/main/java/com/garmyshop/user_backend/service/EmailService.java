package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.ContactoRequestDTO;

public interface EmailService {

    /**
     * Envía un email para el reseteo de contraseña.
     * 
     * @param destinatarioEmail
     * @param nombreUsuario
     * @param token
     * @param frontendResetUrl
     */
    void enviarEmailReseteoPassword(String destinatarioEmail, String nombreUsuario, String token,
            String frontendResetUrl);

    /**
     * Envía un email desde el formulario de contacto al email de soporte.
     * 
     * @param datosFormulario Los datos recibidos del formulario.
     */
    void enviarEmailDeContacto(ContactoRequestDTO datosFormulario);

}