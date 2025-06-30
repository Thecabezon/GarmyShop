// src/components/Auth/LoginForm.jsx
import React, { useState, useEffect } from 'react'; // Importa useEffect
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Importa useLocation
import AuthLayout from './AuthLayout';
import '../../styles/auth.css';
import authService from './authService'; // Asegúrate de que esta ruta sea correcta

// Iconos (mantén tus iconos)
const EyeIcon = () => ( <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> );
const EyeOffIcon = () => ( <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg> );
const GoogleIcon = () => ( <svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> );


const LoginForm = ({ onAuthChange }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Hook para acceder al estado de navegación

  // Leer el posible error pasado por el OAuth2RedirectHandler
  const oauthError = location.state?.oauthError;
  
  // Mostrar el error de OAuth2 si existe y luego limpiarlo del estado para que no persista
  useEffect(() => {
    if (oauthError) {
      setError('Error durante el login con Google: ' + oauthError);
      // Limpiar el estado de navegación para que el error no aparezca de nuevo
      // si el usuario regresa a /login
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [oauthError, navigate, location.pathname]); // Dependencias para re-ejecutar el efecto


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Limpiar errores anteriores (incluyendo posibles errores de OAuth2)
    
    try {
      await authService.login(formData.email, formData.password);
      
      if (onAuthChange) {
        onAuthChange(); // Notificar a App.js
      }
      
      navigate('/'); // Redirigir al éxito
      
    } catch (error) {
      console.error('Error en login:', error);
      // Intentar obtener un mensaje de error específico
      const errorMessage = error.message || error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // ** CORRECCIÓN AQUÍ: USAR LA URL COMPLETA DEL BACKEND **
    // Redirige el navegador al endpoint de inicio de OAuth2 de Google en tu backend.
    // Este endpoint está configurado en tu SecurityConfig y escucha en el puerto 8085.
    // Al usar la URL completa, el navegador inicia una nueva navegación a ese origen y ruta.
    window.location.href = 'http://localhost:8085/oauth2/authorization/google'; 
    
    // Opcional: Deshabilitar el botón o mostrar un indicador de carga mientras se redirige
    // setIsLoading(true); // Puedes descomentar si quieres mostrar carga inmediatamente
  };

  return (
    <AuthLayout title="Inicia Sesión">
      <form onSubmit={handleSubmit} className="auth-form">
        {/* Mostrar errores, incluyendo los recibidos de la redirección OAuth2 */}
        {error && <div className="auth-error">{error}</div>}
        
        <div className="auth-input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
            required
            disabled={isLoading}
          />
        </div>

        <div className="auth-input-group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
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

        <div className="forgot-password-link">
          <Link to="/recuperar-password" className="auth-link">
            ¿Olvidaste Tu Contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="auth-button"
        >
          {isLoading ? (
            <span className="loading-content">
              {/* <span className=""></span> */}
              Iniciando Sesión...
            </span>
          ) : (
            'Iniciar Sesión'
          )}
        </button>

        <div className="auth-divider">
          <span>O</span>
        </div>

        {/* Botón de Google: Llama a handleGoogleLogin */}
        <button 
          type="button" 
          onClick={handleGoogleLogin}
          disabled={isLoading} 
          className="google-button"
        >
          <GoogleIcon />
          Continuar con Google
        </button>

        <div className="auth-footer">
          <span>¿Eres Nuevo En GramyShop? </span>
          <Link to="/registro" className="auth-link">
            Crea Una Cuenta.
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginForm;