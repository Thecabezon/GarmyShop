const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const authProvider = {
  // Función de login
  login: async ({ username, password }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error de autenticación');
      }

      const data = await response.json();
      
      // Guardar token y datos del usuario
      localStorage.setItem('auth_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user_info', JSON.stringify(data.user));
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  // Función de logout
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    return Promise.resolve();
  },

  // Verificar si el usuario está autenticado
  checkAuth: () => {
    const token = localStorage.getItem('auth_token');
    return token ? Promise.resolve() : Promise.reject();
  },

  // Manejar errores de autenticación
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // Obtener información del usuario
  getIdentity: () => {
    try {
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        return Promise.resolve({
          id: user.id,
          fullName: `${user.first_name} ${user.last_name}`.trim() || user.username,
          avatar: user.avatar || undefined,
        });
      }
      return Promise.reject();
    } catch (error) {
      return Promise.reject();
    }
  },

  // Obtener permisos del usuario
  getPermissions: () => {
    try {
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        return Promise.resolve({
          role: user.is_staff ? 'admin' : 'user',
          permissions: user.user_permissions || [],
        });
      }
      return Promise.reject();
    } catch (error) {
      return Promise.reject();
    }
  },
};

export default authProvider;