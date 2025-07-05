import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import '../../styles/Auth.css'; // Reutilizamos los estilos de autenticación
import authService from './authService';

// Reutilizamos los iconos de ojo si los necesitas para ver la contraseña
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
  </svg>
);

const CheckIcon = () => ( // Icono de éxito
  <svg viewBox="0 0 24 24" fill="currentColor" className="check-icon">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);


const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tokenError, setTokenError] = useState(''); // Estado específico para error de token

  // Efecto para obtener el token de la URL cuando el componente carga
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      // Si no hay token en la URL, muestra un error o redirige
      setTokenError('No se encontró un token válido para restablecer la contraseña.');
    }
  }, [searchParams]); // Se ejecuta cuando searchParams cambia

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
        setError('No se puede restablecer la contraseña. Falta el token.');
        return;
    }

    if (nuevaPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    setError(''); // Limpia errores anteriores

    try {
      // Llamar al servicio para restablecer la contraseña
      // La función resetPassword en authService ya está bien implementada
      await authService.resetPassword(token, nuevaPassword);

      // Si tiene éxito
      setIsSubmitted(true);
      // Opcional: Redirigir al login después de unos segundos
      setTimeout(() => {
         navigate('/login');
      }, 3000); // Redirige después de 3 segundos

    } catch (err) {
      console.error('Error al restablecer contraseña:', err);
      // El error viene como texto plano o JSON desde handleResponse en authService
      // Intentamos mostrarlo de forma legible
      setError(`Error al restablecer la contraseña: ${String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Si hay un error de token, mostramos un mensaje en lugar del formulario
  if (tokenError) {
    return (
      <AuthLayout title="Error" subtitle="Token no válido o ausente">
        <div className="auth-error">
            {tokenError}
            <p>Por favor, regresa a la página de <Link to="/recuperar-password">Recuperar Contraseña</Link> y solicita un nuevo enlace.</p>
        </div>
        <Link to="/login" className="back-to-login-link">
            Volver al Login
        </Link>
      </AuthLayout>
    );
  }


  // Si ya se envió con éxito
  if (isSubmitted) {
    return (
      <AuthLayout title="¡Contraseña Restablecida!" subtitle="Tu contraseña ha sido actualizada con éxito">
        <div className="success-container">
          <div className="success-icon-container">
            <div className="success-icon-circle">
              <CheckIcon />
            </div>
          </div>
          <div className="success-message">
            <p className="success-text">
              Ahora puedes iniciar sesión con tu nueva contraseña.
            </p>
          </div>
          <Link to="/login" className="auth-button">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // Mostrar el formulario si no hay error de token ni se ha enviado
  return (
    <AuthLayout 
      title="Establecer Nueva Contraseña" 
      subtitle="Ingresa y confirma tu nueva contraseña"
    >
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}
        
        {/* Input Nueva Contraseña */}
        <div className="auth-input-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nueva Contraseña"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            className="auth-input"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
            disabled={isLoading}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        {/* Input Confirmar Contraseña */}
        <div className="auth-input-group">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar Nueva Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-input"
            required
            disabled={isLoading}
          />
           <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="password-toggle"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !token} // Deshabilita si carga o no hay token
          className="auth-button"
        >
          {isLoading ? (
            <span className="loading-content">
              <span className="spinner"></span>
              Restableciendo...
            </span>
          ) : (
            'Restablecer Contraseña'
          )}
        </button>

        {/* Back to Login */}
        <Link to="/login" className="back-to-login-link">
            Volver al Login
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordForm;