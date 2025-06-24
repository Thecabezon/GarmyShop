package com.garmyshop.user_backend.service.impl;

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

    // Podrías obtener el email "from" desde application.properties si quieres
    @Value("${spring.mail.username}") // Asume que el email "from" es el mismo que el de autenticación SMTP
    private String fromEmail;

    
    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void enviarEmailReseteoPassword(String destinatarioEmail, String nombreUsuario, String token, String frontendResetUrl) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(destinatarioEmail);
            message.setSubject("GarmyShop - Solicitud de Reseteo de Contraseña");

            String resetLink = frontendResetUrl + "?token=" + token;

            String emailBody = String.format(
                "Hola %s,\n\n" +
                "Hemos recibido una solicitud para resetear tu contraseña para tu cuenta de GarmyShop.\n\n" +
                "Por favor, haz clic en el siguiente enlace para establecer una nueva contraseña:\n" +
                "%s\n\n" +
                "Este enlace expirará en 1 hora (o según la configuración del token).\n\n" +
                "Si no solicitaste este reseteo, puedes ignorar este email de forma segura.\n\n" +
                "Saludos,\nEl equipo de GarmyShop",
                nombreUsuario,
                resetLink
            );
            message.setText(emailBody);

            mailSender.send(message);
            logger.info("Email de reseteo de contraseña enviado exitosamente a {}", destinatarioEmail);
        } catch (MailException e) {
            logger.error("Error al enviar email de reseteo de contraseña a {}: {}", destinatarioEmail, e.getMessage());
            // Aquí podrías lanzar una excepción personalizada si quieres que la lógica de negocio
            // principal se entere de que el email no se pudo enviar.
            // Por ahora, solo lo logueamos.
            // throw new EmailSendingException("Error al enviar email de reseteo.", e);
        }
    }
}