
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
const authProvider = {
  login: ({ username, password }) => {
    const csrfToken = getCookie('csrftoken'); // <-- OBTENER EL TOKEN
    const headers = new Headers({ 'Content-Type': 'application/json' });

    if (csrfToken) {
      headers.set('X-CSRFToken', csrfToken); // <-- AÑADIR LA CABECERA
    } else {
      console.warn('CSRF token not found. Login might fail.');
      // Decide cómo manejar esto: ¿fallar la petición o enviarla y esperar 403?
      // Lanzar un error aquí puede dar una mejor experiencia de usuario si el token es esencial.
      // throw new Error('CSRF token not available.');
    }

    return fetch('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: headers, // <-- USAR LAS CABECERAS CON EL TOKEN
      credentials: 'include',
    }).then(response => {
      if (!response.ok) {
         // Puedes añadir aquí una comprobación más específica si quieres,
         // por ejemplo, si response.status === 403, es probablemente CSRF
         // o permisos, si es 400, son credenciales inválidas.
        throw new Error('Credenciales inválidas');
      }
      return response.json();
    });
  },

  logout: () => {
    const csrfToken = getCookie('csrftoken'); 
    const headers = new Headers({}); 

    if (csrfToken) {
       headers.set('X-CSRFToken', csrfToken); 
    } else {
       console.warn('CSRF token not found. Logout might fail.');
    }

    return fetch('/api/auth/logout/', {
      method: 'POST',
      headers: headers, 
      credentials: 'include',
    }).then(() => Promise.resolve());
  },

  checkAuth: () => {
    // GET request, no necesita CSRF header
    return fetch('/api/auth/user/', { credentials: 'include' })
      .then(response => {
        if (response.ok) {
          return Promise.resolve();
        } else {
          return Promise.reject();
        }
      })
      .catch(() => Promise.reject());
  },

  checkError: (error) => {
    if (error.status === 401 || error.status === 403) {
      
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => Promise.resolve(), // GET, no necesita CSRF

  getUserIdentity: () => {
     // GET request, no necesita CSRF header
    return fetch('/api/auth/user/', { credentials: 'include' })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject();
      })
      .catch(() => Promise.reject());
  },
};

export default authProvider;