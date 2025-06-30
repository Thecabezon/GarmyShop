// src/components/Auth/OAuth2RedirectHandler.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from './authService'; 
import '../../styles/auth.css'; // Usa el archivo CSS que aplique a tus contenedores y spinner si tienes

const OAuth2RedirectHandler = ({ onAuthChange }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Analizar los parámetros de la URL recibidos del backend
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      // Éxito: Token recibido del backend
      console.log('OAuth2RedirectHandler: Token recibido.');
      authService.handleOAuth2Token(token); // Guarda el token
      if (onAuthChange) {
        onAuthChange(); // Dispara la carga de datos del usuario en App.js
      }
      // Redirige a la página principal (o a donde quieras ir después del login)
      navigate('/', { replace: true }); // replace: true evita que esta URL quede en el historial
    } else if (error) {
      // Error: Algo salió mal en el backend o en Google
      console.error('OAuth2RedirectHandler: Error recibido:', error);
      // Redirige a la página de login, pasando el mensaje de error
      navigate('/login', { state: { oauthError: error }, replace: true });
    } else {
      // Caso inesperado: Ni token ni error
      console.error('OAuth2RedirectHandler: No token or error received.');
      navigate('/login', { state: { oauthError: 'Error desconocido durante el login con Google.' }, replace: true });
    }
  }, [location, navigate, onAuthChange]); // Dependencias: re-ejecutar si cambian

  // Puedes renderizar un spinner o mensaje de carga mientras se procesa la redirección
  return (
    <div className="auth-container"> {/* Usa alguna clase de contenedor si tienes */}
      <div className="auth-form"> {/* Usa alguna clase para centrar/estilar */}
        <p>Procesando inicio de sesión con Google...</p>
        {/* Puedes añadir un spinner aquí */}
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;