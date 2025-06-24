
const API_URL = 'http://localhost:8085/api/auth';

// Función para manejar errores de respuesta (mejorada)
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let responseBody;

  // Primero, intenta leer el cuerpo de la respuesta como texto
  try {
    responseBody = await response.text();
  } catch (err) {
    // Si falla la lectura del cuerpo, rechaza con el estado del texto
    return Promise.reject(response.statusText);
  }

  // Si la respuesta no fue exitosa (ej. 400, 500)
  if (!response.ok) {
    // Rechaza la promesa con el cuerpo del error (que puede ser texto plano)
    return Promise.reject(responseBody);
  }

  // Si la respuesta fue exitosa, intenta parsearla como JSON
  try {
    return JSON.parse(responseBody);
  } catch (err) {
    // Si no es JSON pero la respuesta fue OK, devuelve el texto plano
    return responseBody;
  }
};

const authService = {
  // ... (login, logout, etc. sin cambios)
  login: async (usernameOrEmail, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, password })
    });
    
    const data = await handleResponse(response);
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email
      }));
    }
    
    return data;
  },

  // Registrar nuevo usuario (MODIFICADO)
  register: async (firstName, lastName, username, email, password) => {
    const response = await fetch(`${API_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        username, // <-- ENVIAR USERNAME
        email,
        password
      })
    });

    return handleResponse(response);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    return handleResponse(response);
  },

  resetPassword: async (token, nuevaPassword) => {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, nuevaPassword })
    });

    return handleResponse(response);
  },

  fetchUserProfile: async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      return Promise.reject('No hay token de autenticación');
    }

    const response = await fetch(`${API_URL}/perfil`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return handleResponse(response);
  }
};

export default authService;