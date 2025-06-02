import React from 'react';
import '../../styles/auth.css';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-container">
      {/* Lado izquierdo - Imagen */}
      <div className="auth-image-section">
        <img 
          src="https://cdn0.salir.com/es/articles/1/2/9/las_mejores_tiendas_en_gran_de_gracia_2921_600_square.jpg" 
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