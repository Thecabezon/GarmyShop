
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import '../../styles/Auth.css';
import authService from './authService';

// Iconos (mantener los que ya tienes)
const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="email-icon">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="arrow-icon">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="check-icon">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Llamar al servicio de recuperación de contraseña
      await authService.forgotPassword(email);
      
      // Mostrar pantalla de éxito
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error al solicitar recuperación de contraseña:', error);
      setError('Error al procesar la solicitud. Inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Volver a llamar al servicio de recuperación de contraseña
      await authService.forgotPassword(email);
      alert('Email reenviado. Por favor, revisa tu bandeja de entrada.');
    } catch (error) {
      console.error('Error al reenviar email:', error);
      setError('Error al reenviar el email. Inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout title="¡Email Enviado!" subtitle="Revisa tu bandeja de entrada">
        <div className="success-container">
          {/* Icono de éxito */}
          <div className="success-icon-container">
            <div className="success-icon-circle">
              <CheckIcon />
            </div>
          </div>
          
          {/* Mensaje principal */}
          <div className="success-message">
            <p className="success-text">
              Hemos enviado un enlace de recuperación a:
            </p>
            <p className="success-email">{email}</p>
          </div>
          
          {/* Instrucciones */}
          <div className="success-instructions">
            <p>
              Si no recibes el email en unos minutos, revisa tu carpeta de spam 
              o correo no deseado.
            </p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          {/* Botones de acción */}
          <div className="success-actions">
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="auth-button secondary-button"
            >
              {isLoading ? 'Enviando...' : 'Reenviar Email'}
            </button>
            
            <Link to="/login" className="back-to-login-button">
              <ArrowLeftIcon />
              Volver al Login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Recuperar Contraseña" 
      subtitle="Te enviaremos un enlace seguro para restablecer tu contraseña"
    >
      <div className="forgot-password-container">
        {/* Icono de email */}
        <div className="forgot-icon-container">
          <EmailIcon />
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          
          {/* Email Input */}
          <div className="auth-input-group">
            <input
              type="email"
              placeholder="Ingresa tu email registrado"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
              disabled={isLoading}
            />
          </div>

          {/* Información adicional */}
          <div className="forgot-info">
            <p>
              Ingresa el email asociado a tu cuenta y te enviaremos 
              las instrucciones para crear una nueva contraseña.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="auth-button"
          >
            {isLoading ? (
              <span className="loading-content">
                <span className="spinner"></span>
                Enviando...
              </span>
            ) : (
              'Enviar email'
            )}
          </button>

          {/* Back to Login */}
          <Link to="/login" className="back-to-login-link">
            <ArrowLeftIcon />
            Volver al Login
          </Link>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordForm;