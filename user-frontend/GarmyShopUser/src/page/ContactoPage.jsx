// src/page/ContactoPage.jsx

import React, { useState, useEffect } from 'react';
import contactService from '../services/contactService'; // <-- Importamos nuestro nuevo servicio
import '../styles/ContactoPage.css';

const ContactoPage = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        asunto: 'problema-pedido',
        mensaje: '',
    });

    // Nuevos estados para manejar el envío real
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // La función de envío ahora es asíncrona
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Llamamos al servicio para enviar el mensaje
            await contactService.enviarMensaje(formData);
            setIsSubmitted(true); // Si tiene éxito, mostramos el mensaje de gracias
        } catch (error) {
            // Si falla, guardamos el mensaje de error para mostrarlo
            setSubmitError(error.toString() || 'Ocurrió un error al enviar el mensaje. Inténtelo más tarde.');
            console.error('Error al enviar formulario de contacto:', error);
        } finally {
            setIsSubmitting(false); // Dejamos de mostrar el estado de "cargando"
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="contact-page-container">
            {/* ... la sección <section className="contact-hero"> no cambia ... */}
            <section className="contact-hero">
                <div className="contact-hero-content">
                    <h1>Estamos para Ayudarte</h1>
                    <p>Tu opinión es muy importante para nosotros. ¡No dudes en contactarnos!</p>
                </div>
            </section>

            <section className="contact-main-content">
                {/* ... la sección <div className="contact-info-section"> no cambia ... */}
                <div className="contact-info-section">
                    <h2>Información de Contacto</h2>
                    <p className="contact-intro">
                        Si tienes algún problema con un pedido, no encuentras un producto o simplemente quieres darnos una recomendación, utiliza cualquiera de estos medios.
                    </p>
                    <ul className="contact-details-list">
                        <li>
                            <i className="bi bi-envelope-fill icon-pink"></i>
                            <div className="contact-detail-text">
                                <strong>Email de Soporte</strong>
                                <a href="mailto:garmyshopgs@gmail.com">garmyshopgs@gmail.com</a>
                            </div>
                        </li>
                        <li>
                            <i className="bi bi-telephone-fill icon-pink"></i>
                            <div className="contact-detail-text">
                                <strong>Teléfono</strong>
                                <span>+51 987 654 321 (Lunes a Viernes, 9am - 6pm)</span>
                            </div>
                        </li>
                        <li>
                            <i className="bi bi-geo-alt-fill icon-pink"></i>
                            <div className="contact-detail-text">
                                <strong>Oficina Central</strong>
                                <span>Lima, Perú (Solo operaciones, no es tienda física)</span>
                            </div>
                        </li>
                    </ul>
                    <h3 className="social-title">Síguenos en Redes</h3>
                    <div className="contact-social-icons">
                        <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                        <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                        <a href="#" aria-label="Pinterest"><i className="bi bi-pinterest"></i></a>
                        <a href="#" aria-label="TikTok"><i className="bi bi-tiktok"></i></a>
                    </div>
                </div>

                <div className="contact-form-section">
                    {isSubmitted ? (
                        <div className="success-message">
                            <i className="bi bi-check-circle-fill"></i>
                            <h3>¡Mensaje Enviado!</h3>
                            <p>Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos en tu correo a la brevedad posible.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <h2>Envíanos un Mensaje Directo</h2>
                            {/* Mostramos un mensaje de error si algo falla */}
                            {submitError && <p className="error-message-form">{submitError}</p>}

                            <div className="form-group">
                                <label htmlFor="nombre">Tu Nombre</label>
                                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required disabled={isSubmitting} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Tu Email</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required disabled={isSubmitting} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="asunto">Asunto</label>
                                <select id="asunto" name="asunto" value={formData.asunto} onChange={handleChange} disabled={isSubmitting}>
                                    <option value="problema-pedido">Problema con un Pedido</option>
                                    <option value="duda-producto">Duda sobre un Producto</option>
                                    <option value="sugerencia">Sugerencia o Recomendación</option>
                                    <option value="otro">Otro Motivo</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="mensaje">Mensaje</label>
                                <textarea id="mensaje" name="mensaje" rows="5" value={formData.mensaje} onChange={handleChange} required disabled={isSubmitting}></textarea>
                            </div>
                            <button type="submit" className="submit-contact-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ContactoPage;