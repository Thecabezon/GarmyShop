import { API_BASE_URL } from '../../config/apiConfig';

const API_URL = `${API_BASE_URL}/api/auth`;

// Función para manejar errores de respuesta
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let responseBody;

  try {
    responseBody = await response.text();
  } catch (err) {
    return Promise.reject(response.statusText || `Error reading response body: ${err.message}`);
  }

  if (!response.ok) {
    if (contentType && contentType.includes("application/json")) {
      try {
        const errorJson = JSON.parse(responseBody);
        return Promise.reject(errorJson);
      } catch (e) {
        return Promise.reject(responseBody || response.statusText);
      }
    } else {
      return Promise.reject(responseBody || response.statusText);
    }
  }

  if (responseBody) {
    try {
      return JSON.parse(responseBody);
    } catch (err) {
      return responseBody;
    }
  } else {
    return null;
  }
};


const authService = {
  login: async (usernameOrEmail, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, password })
    });

    const data = await handleResponse(response);

    if (data && data.accessToken) {
      const basicUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName
      };

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(basicUser));

      console.log("authService: Login exitoso, token y usuario guardados.");

      return { ...data, userInfo: basicUser };
    }

    return data;
  },

  register: async (firstName, lastName, username, email, password) => {
    const response = await fetch(`${API_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        username,
        email,
        password
      })
    });
    console.log("authService: Intentando registrar usuario...");
    return handleResponse(response);
  },

  logout: () => {
    console.log("authService: Cerrando sesión (limpiando datos de auth)...");
    authService.clearAuthData();
  },

  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log("authService: Token y user removidos de localStorage.");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error("authService: Error parsing user from localStorage", e);
      authService.clearAuthData();
      return null;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    console.log("authService.isAuthenticated: Token presente?", !!token);
    return !!token;
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    console.log("authService: Solicitando reset de password...");
    return handleResponse(response);
  },

  resetPassword: async (token, nuevaPassword) => {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, nuevaPassword })
    });
    console.log("authService: Intentando resetear password...");
    return handleResponse(response);
  },

  fetchUserProfile: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('authService: fetchUserProfile llamado sin token.');
      return Promise.reject('No autenticado');
    }

    console.log("authService: Intentando obtener perfil de usuario...");
    const response = await fetch(`${API_URL}/perfil`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return handleResponse(response);
  },

  // ** NUEVO: Método para manejar el token recibido desde OAuth2 Redirect **
  handleOAuth2Token: (token) => {
    if (token) {
      localStorage.setItem('token', token); // Usa la clave 'token'
      console.log("authService: Token OAuth2 guardado.");
      // Nota: No guardamos 'user' aquí porque el token OAuth2 no suele incluir toda la info
      // La lógica en App.js (loadUserData) se encargará de llamar a fetchUserProfile()
      // si hay token pero no hay datos de usuario guardados localmente.
    }
  },

};

export default authService;