import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from './authService'; // Asegúrate de que la ruta sea correcta
import '../../styles/UserDropdown.css'; // Asegúrate de que la ruta sea correcta

const UserDropdown = ({ isAuthenticated, userInfo, onClose, onAuthChange }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("UserDropdown: Cerrar Sesión clickeado.");
    // Llama al método logout que limpia token y user en localStorage
    authService.logout();

    // Notifica al componente App.js que el estado de autenticación ha cambiado.
    // App.js debe tener una función handleAuthChange que actualice sus estados
    // currentUser y isAuthenticated (usando authService.getCurrentUser() y authService.isAuthenticated()).
    if (onAuthChange) {
      onAuthChange(); // Llama a la función pasada desde App.js
    }

    // Cierra el dropdown visualmente
    onClose();

    // Navega a la página de inicio o login después de cerrar sesión
    navigate('/');
  };

  // Console log para verificar el estado que recibe el componente (Puedes dejarlo o quitarlo)
  // console.log("UserDropdown: Rendering with isAuthenticated:", isAuthenticated, "userInfo:", userInfo);

  return (
    // Contenedor principal del dropdown. Estilos de .user-dropdown controlan posición, sombra, etc.
    <div className="user-dropdown">
      {/* Condicional: Muestra un contenido si está autenticado, otro si no */}
      {isAuthenticated ? (
        // Contenido para usuario autenticado - Envolvente con key para React
        // La key ayuda a React a identificar este bloque de forma única al cambiar entre estados
        <div key="authenticated-dropdown-content">
          {/* Sección de información del usuario logeado */}
          <div className="user-info">
            <div className="user-avatar">
              {/* Muestra la primera letra del nombre o usuario como avatar */}
              {userInfo?.firstName?.charAt(0).toUpperCase() ||
               userInfo?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <p className="user-name">
                {/* Saludo con el nombre o usuario */}
                ¡Hola, {userInfo?.firstName || userInfo?.username || 'Usuario'}!
              </p>
              {/* Muestra el email si está disponible */}
              {userInfo?.email && <p className="user-email">{userInfo.email}</p>}
            </div>
          </div>

          {/* Línea separadora visual */}
          <div className="dropdown-divider"></div>

          {/* Menú de opciones para usuario autenticado (Mi Perfil, Mis Pedidos, etc.) */}
          <ul className="dropdown-menu">
            <li>
              {/* Enlace a la página de perfil */}
              <Link to="/perfil" onClick={onClose}> {/* Cierra el dropdown al hacer clic */}
                <i className="bi bi-person-circle"></i> Mi Perfil
              </Link>
            </li>
            <li>
              {/* Enlace a la página de mis pedidos */}
              <Link to="/mis-pedidos" onClick={onClose}> {/* Cierra el dropdown al hacer clic */}
                <i className="bi bi-box-seam"></i> Mis Pedidos
              </Link>
            </li>
            <li>
              {/* Enlace a la página de direcciones */}
              <Link to="/direcciones" onClick={onClose}> {/* Cierra el dropdown al hacer clic */}
                <i className="bi bi-geo-alt"></i> Mis Direcciones
              </Link>
            </li>
            {/* Opción para cerrar sesión */}
            <li>
              {/* Botón que ejecuta la función handleLogout */}
              {/* La clase logout-button puede tener estilos específicos (como color rojo) */}
              <button onClick={handleLogout} className="logout-button">
                <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      ) : (
        // Contenido para usuario no autenticado (invitado) - Envolvente con key
        <div key="guest-dropdown-content">
          {/* Mensaje de bienvenida para invitados */}
          <div className="guest-message">
            <p>¡Bienvenido a GarmyShop!</p>
            <p className="guest-submessage">Inicia sesión para ver tus pedidos y más.</p>
          </div>

          {/* Botones de autenticación (Login y Registro) */}
          <div className="auth-buttons">
            <Link to="/login" className="login-button" onClick={onClose}> {/* Cierra dropdown al navegar */}
              Iniciar Sesión
            </Link>
            <Link to="/registro" className="register-button" onClick={onClose}> {/* Cierra dropdown al navegar */}
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;