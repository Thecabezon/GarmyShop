import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
      <footer className="bg-footer text-white py-5 mt-5">

        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h5 className="fw-bold mb-3 text-pink">🌷 Gamyshop</h5>
              <p className="text-light"> 
                Tu destino de moda femenina online. 
                Descubre las últimas tendencias y prendas exclusivas 
                para expresar tu estilo único.
              </p>
              {/* Redes Sociales - los iconos y enlaces serán blancos */}
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
            
            <div className="col-md-2 mb-4">
              <h6 className="fw-bold mb-3 text-pink">Enlaces Útiles</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="/" className="text-white text-decoration-none">
                    Inicio
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/tienda" className="text-white text-decoration-none">
                    Productos
                  </a>
                </li>
               
                 <li className="mb-2">
                  <a href="/nosotros" className="text-white text-decoration-none">
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
              <h6 className="fw-bold mb-3 text-pink">Ayuda y Servicios</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="/como-comprar" className="text-white text-decoration-none">
                    <i className="bi bi-cart3 me-2 text-pink"></i> 
                    Cómo Comprar
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/envios" className="text-white text-decoration-none">
                    <i className="bi bi-truck me-2 text-pink"></i> 
                    Información de Envío
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/devoluciones" className="text-white text-decoration-none">
                    <i className="bi bi-arrow-repeat me-2 text-pink"></i> 
                    Devoluciones y Cambios
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/guia-tallas" className="text-white text-decoration-none">
                    <i className="bi bi-rulers me-2 text-pink"></i> 
                    Guía de Tallas
                  </a>
                </li>
                 <li className="mb-2">
                  <a href="/soporte" className="text-white text-decoration-none">
                    <i className="bi bi-chat-dots me-2 text-pink"></i> 
                    Soporte (Chatbot disponible)
                  </a>
                </li>
              </ul>
            </div>
  
            <div className="col-md-3 mb-4">
              <h6 className="fw-bold mb-3 text-pink">Suscríbete</h6>
              <p className="text-light">
                Sé la primera en enterarte de nuestras novedades, ofertas y 
                promociones exclusivas.
              </p>
              <form>
                <div className="mb-3">
                  <input 
                    type="email" 
                    className="form-control" 
                    id="newsletterEmail" 
                    placeholder="Ingresa tu correo electrónico" 
                    aria-label="Ingresa tu correo electrónico para suscribirte"
                  />
                </div>
                <button type="submit" className="btn btn-pink w-100">
                  Suscribirse
                </button>
              </form>
            </div>

          </div>
  
          <hr className="my-4 border-light" /> 
          
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-light mb-0 text-center text-md-start">
                © 2025 Gamyshop. Todos los derechos reservados.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <a href="/terminos" className="text-white text-decoration-none me-3">
                Términos de Servicio
              </a>
              <a href="/privacidad" className="text-white text-decoration-none">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;