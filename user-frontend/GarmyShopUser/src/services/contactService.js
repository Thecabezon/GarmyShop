import { API_BASE_URL } from '../config/apiConfig';

const API_URL = `${API_BASE_URL}/api/contacto`;

const handleResponse = async (response) => {
    const responseBody = await response.text();
    if (!response.ok) {
        try {
            const errorJson = JSON.parse(responseBody);
            return Promise.reject(errorJson.message || 'Error en la solicitud.');
        } catch (e) {
            return Promise.reject(responseBody || response.statusText);
        }
    }
    return responseBody ? JSON.parse(responseBody) : null;
};

const contactService = {
    enviarMensaje: async (formData) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        return handleResponse(response);
    },
};

export default contactService;