package com.garmyshop.user_backend.service.impl;

import com.garmyshop.user_backend.dto.ContactoRequestDTO;
import com.garmyshop.user_backend.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void enviarEmailReseteoPassword(String destinatarioEmail, String nombreUsuario, String token,
            String frontendResetUrl) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(destinatarioEmail);
            message.setSubject("GarmyShop - Solicitud de Reseteo de Contraseña");

            String resetLink = frontendResetUrl + "?token=" + token;

            String emailBody = String.format(
                    "Hola %s,\n\n" +
                            "Hemos recibido una solicitud para resetear tu contraseña para tu cuenta de GarmyShop.\n\n"
                            +
                            "Por favor, haz clic en el siguiente enlace para establecer una nueva contraseña:\n" +
                            "%s\n\n" +
                            "Este enlace expirará en 1 hora (o según la configuración del token).\n\n" +
                            "Si no solicitaste este reseteo, puedes ignorar este email de forma segura.\n\n" +
                            "Saludos,\nEl equipo de GarmyShop",
                    nombreUsuario,
                    resetLink);
            message.setText(emailBody);

            mailSender.send(message);
            logger.info("Email de reseteo de contraseña enviado exitosamente a {}", destinatarioEmail);
        } catch (MailException e) {
            logger.error("Error al enviar email de reseteo de contraseña a {}: {}", destinatarioEmail, e.getMessage());
        }
    }

    @Override
    public void enviarEmailDeContacto(ContactoRequestDTO datosFormulario) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(fromEmail);

            message.setSubject("Nuevo Mensaje de Contacto - GarmyShop: " + datosFormulario.getAsunto());

            String emailBody = String.format(
                    "Has recibido un nuevo mensaje desde el formulario de contacto de GarmyShop.\n\n" +
                            "--------------------------------------------------\n" +
                            "De: %s\n" +
                            "Email del remitente: %s\n" +
                            "Asunto seleccionado: %s\n" +
                            "--------------------------------------------------\n\n" +
                            "Mensaje:\n%s",
                    datosFormulario.getNombre(),
                    datosFormulario.getEmail(),
                    datosFormulario.getAsunto(),
                    datosFormulario.getMensaje());

            message.setText(emailBody);

            mailSender.send(message);
            logger.info("Email de contacto de '{}' enviado exitosamente.", datosFormulario.getEmail());

        } catch (MailException e) {
            logger.error("Error al enviar email de contacto de {}: {}", datosFormulario.getEmail(), e.getMessage());
        }
    }

}