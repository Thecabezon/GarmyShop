
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/UserDropdown.css'; // Crearemos este archivo después

const UserDropdown = ({ isAuthenticated, userInfo, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminar token y datos de usuario del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Recargar la página o navegar a inicio
    window.location.reload();
    // Alternativa: navigate('/');
    
    // Cerrar el dropdown
    onClose();
  };

  return (
    <div className="user-dropdown">
      {isAuthenticated ? (
        // Usuario autenticado
        <>
          <div className="user-info">
            <div className="user-avatar">
              {userInfo?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <p className="user-name">{userInfo?.username || 'Usuario'}</p>
              <p className="user-email">{userInfo?.email || 'email@ejemplo.com'}</p>
            </div>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <ul className="dropdown-menu">
            <li>
              <Link to="/perfil" onClick={onClose}>
                <i className="bi bi-person-circle"></i>
                Mi Perfil
              </Link>
            </li>
            <li>
              <Link to="/mis-pedidos" onClick={onClose}>
                <i className="bi bi-box-seam"></i>
                Mis Pedidos
              </Link>
            </li>
            <li>
              <Link to="/direcciones" onClick={onClose}>
                <i className="bi bi-geo-alt"></i>
                Mis Direcciones
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                <i className="bi bi-box-arrow-right"></i>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </>
      ) : (
        // Usuario no autenticado
        <>
          <div className="guest-message">
            <p>¡Bienvenido a GramyShop!</p>
            <p className="guest-submessage">Inicia sesión para ver tus pedidos y más.</p>
          </div>
          
          <div className="auth-buttons">
            <Link to="/login" className="login-button" onClick={onClose}>
              Iniciar Sesión
            </Link>
            <Link to="/registro" className="register-button" onClick={onClose}>
              Registrarse
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDropdown;