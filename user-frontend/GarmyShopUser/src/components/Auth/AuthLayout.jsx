import React from 'react';
import '../../styles/Auth.css';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-container">
      {/* Lado izquierdo - Imagen */}
      <div className="auth-image-section">
        <img 
          src="https://i.scdn.co/image/ab6761610000e5eb667b1c37aac06716daa5fe92" 
          alt="Women shopping" 
        />
      </div>
      
      {/* Lado derecho - Formulario */}
      <div className="auth-form-section">
        <div className="auth-form-container">
          {/* Header */}
          <div className="auth-header">
            <h2 className="auth-title">{title}</h2>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>
          
          {/* Contenido del formulario */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;