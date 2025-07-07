import { Link } from 'react-router-dom';
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
                  <Link to="/" className="text-white text-decoration-none">
                    Inicio
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/tienda" className="text-white text-decoration-none">
                    Productos
                  </Link>
                </li>
               
                 <li className="mb-2">
                  <Link to="/nosotros" className="text-white text-decoration-none">
                    Sobre Nosotros
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/contacto" className="text-white text-decoration-none">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
  
            {/* Ayuda y Servicios */}
            <div className="col-md-3 mb-4">
              <h6 className="fw-bold mb-3 text-pink">Ayuda y Servicios</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/envios" className="text-white text-decoration-none">
                    <i className="bi bi-truck me-2 text-pink"></i> 
                    Información de Envío
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/guia-tallas" className="text-white text-decoration-none">
                    <i className="bi bi-rulers me-2 text-pink"></i> 
                    Guía de Tallas
                  </Link>
                </li>
              </ul>
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