import { useNavigate } from 'react-router-dom'; // Aunque no se usa directamente en este archivo, la importación estaba en tu ejemplo anterior.

const API_URL = 'http://localhost:8085/api/auth';

// Función para manejar errores de respuesta
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let responseBody;

  try {
    responseBody = await response.text();
  } catch (err) {
    // Si hay error leyendo el cuerpo, rechazamos con un mensaje genérico o el error de la respuesta
    return Promise.reject(response.statusText || `Error reading response body: ${err.message}`);
  }

  if (!response.ok) {
    // Si la respuesta no es OK, intentar parsear el cuerpo como JSON si es JSON, sino devolver el texto
    if (contentType && contentType.includes("application/json")) {
      try {
        const errorJson = JSON.parse(responseBody);
        return Promise.reject(errorJson); // Rechazar con el objeto JSON de error
      } catch (e) {
        // Si no es JSON válido, rechazar con el texto del cuerpo si existe, o el estado HTTP
        return Promise.reject(responseBody || response.statusText);
      }
    } else {
      // Si no es JSON, rechazar con el texto del cuerpo si existe, o el estado HTTP
       return Promise.reject(responseBody || response.statusText);
    }
  }

  // Si la respuesta es OK, intentar parsear como JSON, de lo contrario devolver el texto si hay cuerpo
   if (responseBody) {
     try {
       return JSON.parse(responseBody);
     } catch (err) {
        // Si no es JSON, devolver el texto tal cual
        return responseBody;
     }
   } else {
     // Si no hay cuerpo (ej: 204 No Content), devolver null o un objeto vacío si es apropiado
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

    if (data && data.accessToken) { // Asegurarse de que data no es null y tiene accessToken
      // Guardar datos básicos del usuario recibidos en el login
      // Se asume que el endpoint /login retorna al menos id, username, email
      // y opcionalmente firstName, lastName.
      const basicUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName, // Incluir si vienen del backend
        lastName: data.lastName    // Incluir si vienen del backend
      };

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(basicUser));

      console.log("authService: Login exitoso, token y usuario guardados.");

      return { ...data, userInfo: basicUser }; // Retornar la data del login y la info del usuario guardada
    }

    // Si handleResponse no rechazó pero no hay accessToken, significa que la respuesta OK no contenía token
    // Esto no debería pasar si el login fue exitoso. Podría ser un error en el backend o handleResponse.
    // En este caso, podrías querer lanzar un error o devolver null/undefined.
    // handleResponse ya se encarga de rechazar en caso de errores HTTP.
    return data; // Si no hay accessToken, `data` podría ser un objeto de éxito sin él.
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
    // Limpiar SOLO los datos de autenticación (token y user)
    authService.clearAuthData();
    // Los datos específicos del usuario (carrito, favoritos) NO se eliminan aquí
    // permitiendo que persistan para la próxima sesión de ese usuario.
  },

  // Función para limpiar solo los datos de autenticación
  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Las claves específicas por usuario (cartItems_<userId>, favoriteItems_<userId>) SE MANTIENEN.
    // Las claves generales de guest (cartItems, favoriteItems) también se mantienen.
    console.log("authService: Token y user removidos de localStorage.");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
     // Devuelve el objeto de usuario si existe en localStorage, null de lo contrario.
     // No verifica la existencia del token aquí, esa lógica se maneja en App.js.
    try {
        return user ? JSON.parse(user) : null;
    } catch (e) {
        console.error("authService: Error parsing user from localStorage", e);
        authService.clearAuthData(); // Limpiar datos inconsistentes si hay error de parseo
        return null;
    }
  },

  isAuthenticated: () => {
    // Considera autenticado solo si hay un token en localStorage.
    // App.js validará si hay datos de usuario correspondientes.
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

    // Asumiendo que el backend usa el token para identificar al usuario
    // La URL puede variar. Usar /perfil si el backend lo obtiene del token.
    // O /perfil/{id} si necesitas el ID (pero es menos seguro pasar ID en URL si ya tienes token)
    console.log("authService: Intentando obtener perfil de usuario...");
    const response = await fetch(`${API_URL}/perfil`, { // Cambié a /perfil, asumiendo que el backend usa el token
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // handleResponse ya maneja errores 401, 403 etc.
    return handleResponse(response);
  }
};

export default authService;