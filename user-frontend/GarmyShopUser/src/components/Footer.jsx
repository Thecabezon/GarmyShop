import React from 'react';
// Si usas Bootstrap Icons, asegúrate de tenerlos configurados en tu proyecto.
// Por ejemplo, importando el CSS en tu archivo principal (ej: index.js o App.js):
// import 'bootstrap-icons/font/bootstrap-icons.css';

const Footer = () => {
    return (
      <footer className="bg-dark text-white py-5 mt-5">
        <div className="container">
          <div className="row">
            {/* Información de la Tienda */}
            <div className="col-md-4 mb-4">
              {/* Puedes reemplazar el H5 con un logo si lo deseas */}
              <h5 className="fw-bold mb-3 text-warning">🛍️ Gamyshop</h5>
              <p className="text-light">
                Tu destino de moda femenina online. 
                Descubre las últimas tendencias y prendas exclusivas 
                para expresar tu estilo único.
              </p>
              {/* Redes Sociales */}
              <div className="d-flex gap-3">
                <a href="[Enlace a Facebook]" className="text-white fs-5" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="[Enlace a Instagram]" className="text-white fs-5" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="[Enlace a Pinterest]" className="text-white fs-5" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-pinterest"></i> {/* Pinterest es común en moda */}
                </a>
                {/* Si tienes Twitter, TikTok, etc., puedes añadirlos */}
                <a href="[Enlace a TikTok]" className="text-white fs-5" target="_blank" rel="noopener noreferrer">
                   <i className="bi bi-tiktok"></i> {/* O TikTok */}
                </a>
              </div>
            </div>
  
            {/* Enlaces rápidos / Navegación */}
            <div className="col-md-2 mb-4">
              <h6 className="fw-bold mb-3 text-warning">Enlaces Útiles</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="/" className="text-light text-decoration-none">
                    Inicio
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/productos" className="text-light text-decoration-none">
                    Productos
                  </a>
                </li>
                 <li className="mb-2">
                  <a href="/categorias" className="text-light text-decoration-none">
                    Categorías
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/promociones" className="text-light text-decoration-none">
                    Promociones
                  </a>
                </li>
                 <li className="mb-2">
                  <a href="/sobre-nosotros" className="text-light text-decoration-none">
                    Sobre Nosotros
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/contacto" className="text-light text-decoration-none">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
  
            {/* Ayuda y Servicios */}
            <div className="col-md-3 mb-4">
              <h6 className="fw-bold mb-3 text-warning">Ayuda y Servicios</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="/como-comprar" className="text-light text-decoration-none">
                    <i className="bi bi-cart3 me-2"></i>
                    Cómo Comprar
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/envios" className="text-light text-decoration-none">
                    <i className="bi bi-truck me-2"></i>
                    Información de Envío
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/devoluciones" className="text-light text-decoration-none">
                    <i className="bi bi-arrow-repeat me-2"></i>
                    Devoluciones y Cambios
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/guia-tallas" className="text-light text-decoration-none">
                    <i className="bi bi-rulers me-2"></i>
                    Guía de Tallas
                  </a>
                </li>
                 <li className="mb-2">
                  {/* Enlace o mención al chatbot. Podría ser un link a una página de soporte
                      donde el chatbot está disponible, o simplemente una mención. */}
                  <a href="/soporte" className="text-light text-decoration-none">
                    <i className="bi bi-chat-dots me-2"></i>
                    Soporte (Chatbot disponible)
                  </a>
                </li>
              </ul>
            </div>
  
            {/* Newsletter Suscripción */}
            <div className="col-md-3 mb-4">
              <h6 className="fw-bold mb-3 text-warning">Suscríbete</h6>
              <p className="text-light">
                Sé la primera en enterarte de nuestras novedades, ofertas y 
                promociones exclusivas.
              </p>
              {/* Formulario de Suscripción - La lógica de envío debe ser implementada */}
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
                <button type="submit" className="btn btn-warning w-100">
                  Suscribirse
                </button>
              </form>
            </div>

          </div> {/* Fin row principal */}
  
          <hr className="my-4 border-secondary" />
          
          {/* Copyright y Enlaces Legales */}
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-light mb-0 text-center text-md-start">
                © 2024 Gamyshop. Todos los derechos reservados.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <a href="/terminos" className="text-light text-decoration-none me-3">
                Términos de Servicio
              </a>
              <a href="/privacidad" className="text-light text-decoration-none">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div> {/* Fin container */}
      </footer>
    );
  };
  
  export default Footer;