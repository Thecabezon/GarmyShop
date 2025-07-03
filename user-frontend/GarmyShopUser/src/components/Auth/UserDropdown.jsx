import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from './authService';
import '../../styles/UserDropdown.css';

const UserDropdown = ({ isAuthenticated, userInfo, onClose, onAuthChange }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("UserDropdown: Cerrar Sesión clickeado.");
    authService.logout();

    if (onAuthChange) {
      onAuthChange();
    }

    onClose();

    navigate('/');
  };


  return (
    <div className="user-dropdown">
      {isAuthenticated ? (
        <div key="authenticated-dropdown-content">
          <div className="user-info">
            <div className="user-avatar">
              {userInfo?.firstName?.charAt(0).toUpperCase() ||
               userInfo?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <p className="user-name">
                ¡Hola, {userInfo?.firstName || userInfo?.username || 'Usuario'}!
              </p>
              {userInfo?.email && <p className="user-email">{userInfo.email}</p>}
            </div>
          </div>

          <div className="dropdown-divider"></div>
          <ul className="dropdown-menu">
            <li>
              
            </li>
            <li>
              <Link to="/mis-pedidos" onClick={onClose}>
                <i className="bi bi-box-seam"></i> Mis Pedidos
              </Link>
            </li>
            <li>
             
            </li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <div key="guest-dropdown-content">
          <div className="guest-message">
            <p>¡Bienvenido a GarmyShop!</p>
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
        </div>
      )}
    </div>
  );
};

export default UserDropdown;