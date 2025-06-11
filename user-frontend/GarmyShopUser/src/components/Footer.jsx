import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
      // Usamos bg-dark para el fondo negro y text-white para el texto general
      <footer className="bg-footer text-white py-5 mt-5">

        <div className="container">
          <div className="row">
            {/* Información de la Tienda */}
            <div className="col-md-4 mb-4">
              {/* Usamos la clase personalizada text-pink para el título */}
              <h5 className="fw-bold mb-3 text-pink">🌷 Gamyshop</h5>
              {/* El texto general sigue siendo blanco gracias a text-white en el footer */}
              <p className="text-light"> 
                Tu destino de moda femenina online. 
                Descubre las últimas tendencias y prendas exclusivas 
                para expresar tu estilo único.
              </p>
              {/* Redes Sociales - los iconos y enlaces serán blancos (text-white) */}
              <div className="d-flex gap-3">
                <a href="[Enlace a Facebook]" className="text-white fs-5" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="[Enlace a Instagram]" className="text-white fs-5" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="[Enlace a Pinterest]" className="text-white fs-5" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-pinterest"></i> 
                </a>
                <a href="[Enlace a TikTok]" className="text-white fs-5" target="_blank" rel="noopener noreferrer">
                   <i className="bi bi-tiktok"></i> 
                </a>
              </div>
            </div>
  
            {/* Enlaces rápidos / Navegación */}
            <div className="col-md-2 mb-4">
              {/* Usamos la clase personalizada text-pink para el título */}
              <h6 className="fw-bold mb-3 text-pink">Enlaces Útiles</h6>
              <ul className="list-unstyled">
                {/* Los enlaces ahora usan text-white */}
                <li className="mb-2">
                  <a href="/" className="text-white text-decoration-none">
                    Inicio
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/productos" className="text-white text-decoration-none">
                    Productos
                  </a>
                </li>
                 <li className="mb-2">
                  <a href="/categorias" className="text-white text-decoration-none">
                    Categorías
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/promociones" className="text-white text-decoration-none">
                    Promociones
                  </a>
                </li>
                 <li className="mb-2">
                  <a href="/sobre-nosotros" className="text-white text-decoration-none">
                    Sobre Nosotros
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/contacto" className="text-white text-decoration-none">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
  
            {/* Ayuda y Servicios */}
            <div className="col-md-3 mb-4">
               {/* Usamos la clase personalizada text-pink para el título */}
              <h6 className="fw-bold mb-3 text-pink">Ayuda y Servicios</h6>
              <ul className="list-unstyled">
                {/* Los enlaces ahora usan text-white, los iconos text-pink */}
                <li className="mb-2">
                  <a href="/como-comprar" className="text-white text-decoration-none">
                    <i className="bi bi-cart3 me-2 text-pink"></i> {/* Icono rosa */}
                    Cómo Comprar
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/envios" className="text-white text-decoration-none">
                    <i className="bi bi-truck me-2 text-pink"></i> {/* Icono rosa */}
                    Información de Envío
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/devoluciones" className="text-white text-decoration-none">
                    <i className="bi bi-arrow-repeat me-2 text-pink"></i> {/* Icono rosa */}
                    Devoluciones y Cambios
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/guia-tallas" className="text-white text-decoration-none">
                    <i className="bi bi-rulers me-2 text-pink"></i> {/* Icono rosa */}
                    Guía de Tallas
                  </a>
                </li>
                 <li className="mb-2">
                  <a href="/soporte" className="text-white text-decoration-none">
                    <i className="bi bi-chat-dots me-2 text-pink"></i> {/* Icono rosa */}
                    Soporte (Chatbot disponible)
                  </a>
                </li>
              </ul>
            </div>
  
            {/* Newsletter Suscripción */}
            <div className="col-md-3 mb-4">
              {/* Usamos la clase personalizada text-pink para el título */}
              <h6 className="fw-bold mb-3 text-pink">Suscríbete</h6>
              {/* El texto sigue siendo blanco */}
              <p className="text-light">
                Sé la primera en enterarte de nuestras novedades, ofertas y 
                promociones exclusivas.
              </p>
              <form>
                <div className="mb-3">
                  {/* El input usa la clase form-control de Bootstrap, que se adapta al tema oscuro */}
                  <input 
                    type="email" 
                    className="form-control" 
                    id="newsletterEmail" 
                    placeholder="Ingresa tu correo electrónico" 
                    aria-label="Ingresa tu correo electrónico para suscribirte"
                  />
                </div>
                {/* Usamos una clase personalizada para el botón rosa */}
                <button type="submit" className="btn btn-pink w-100">
                  Suscribirse
                </button>
              </form>
            </div>

          </div> {/* Fin row principal */}
  
          {/* La línea divisoria ahora es border-light para que sea blanca */}
          <hr className="my-4 border-light" /> 
          
          {/* Copyright y Enlaces Legales */}
          <div className="row align-items-center">
            <div className="col-md-6">
              {/* El texto del copyright sigue siendo blanco */}
              <p className="text-light mb-0 text-center text-md-start">
                © 2025 Gamyshop. Todos los derechos reservados.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
               {/* Los enlaces legales ahora usan text-white */}
              <a href="/terminos" className="text-white text-decoration-none me-3">
                Términos de Servicio
              </a>
              <a href="/privacidad" className="text-white text-decoration-none">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div> {/* Fin container */}
      </footer>
    );
  };
  
  export default Footer;