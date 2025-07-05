// src/config/apiConfig.js

// Lee la variable de entorno definida en los archivos .env.*
// Si la variable no está definida, por seguridad, usa una cadena vacía o lanza un error.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

if (!import.meta.env.VITE_API_BASE_URL) {
    console.warn(
        "La variable de entorno VITE_API_BASE_URL no está definida. " +
        "Usando 'http://localhost:8085' como valor por defecto. " +
        "Asegúrate de configurar esto en Vercel para producción."
    );
}

// Exportamos la URL para poder usarla en toda la aplicación
export { API_BASE_URL };