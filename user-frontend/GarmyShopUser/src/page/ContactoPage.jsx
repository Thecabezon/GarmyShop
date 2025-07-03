// src/page/ContactoPage.jsx

import React, { useState, useEffect } from 'react';
import '../styles/ContactoPage.css'; // Importaremos los estilos que crearemos a continuación

const ContactoPage = () => {
    // Estado para manejar los datos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        asunto: 'problema-pedido', // Valor por defecto
        mensaje: '',
    });

    // Estado para mostrar el mensaje de éxito
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // En un proyecto real, aquí harías la llamada a una API para enviar el email.
        // Para este caso, simulamos el envío exitoso para dar una buena UX.
        console.log('Datos del formulario enviados (simulación):', formData);
        setIsSubmitted(true);
    };

    // Efecto para que la página siempre inicie desde arriba
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="contact-page-container">
            <section className="contact-hero">
                <div className="contact-hero-content">
                    <h1>Estamos para Ayudarte</h1>
                    <p>Tu opinión es muy importante para nosotros. ¡No dudes en contactarnos!</p>
                </div>
            </section>

            <section className="contact-main-content">
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
                            <div className="form-group">
                                <label htmlFor="nombre">Tu Nombre</label>
                                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Tu Email</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="asunto">Asunto</label>
                                <select id="asunto" name="asunto" value={formData.asunto} onChange={handleChange}>
                                    <option value="problema-pedido">Problema con un Pedido</option>
                                    <option value="duda-producto">Duda sobre un Producto</option>
                                    <option value="sugerencia">Sugerencia o Recomendación</option>
                                    <option value="otro">Otro Motivo</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="mensaje">Mensaje</label>
                                <textarea id="mensaje" name="mensaje" rows="5" value={formData.mensaje} onChange={handleChange} required></textarea>
                            </div>
                            <button type="submit" className="submit-contact-btn">Enviar Mensaje</button>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ContactoPage;