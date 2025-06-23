// RUTA: frontend/src/providers/dataProvider.js (CÓDIGO COMPLETO Y SIMPLIFICADO)

import { fetchUtils } from 'react-admin';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

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

const resourceMap = {
  categorias: 'categorias',
  marcas: 'marcas',
  tallas: 'tallas',
  colores: 'colores',
  productos: 'productos',
  'imagenes-producto': 'imagenes-producto',
  'combinaciones-producto': 'combinaciones-producto',
  direcciones: 'direcciones',
  ordenes: 'ordenes',
  'orden-items': 'orden-items',
  usuarios: 'users',
};

const baseHttpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  const method = options.method ? options.method.toUpperCase() : 'GET';
  if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
     const csrfToken = getCookie('csrftoken');
     if (csrfToken) {
         options.headers.set('X-CSRFToken', csrfToken);
     } else {
         console.warn(`CSRF token not found for ${method} ${url}. Request might fail.`);
     }
  }
  options.credentials = 'include';
  if (typeof options.body === 'object' && !(options.body instanceof FormData)) {
      options.headers.set('Content-Type', 'application/json');
      options.body = JSON.stringify(options.body);
  }
  return fetchUtils.fetchJson(url, options);
};

const convertImageToFormData = (image, fieldName = 'imagen') => {
  if (!image || !image.rawFile) return null;
  const formData = new FormData();
  formData.append(fieldName, image.rawFile);
  return formData;
};

const dataProvider = {
  getList: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = params.filter;
    const url = new URL(`${API_URL}/${endpoint}/`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('page_size', String(perPage));
    if (field) {
      const ordering = order === 'DESC' ? `-${field}` : field;
      url.searchParams.set('ordering', ordering);
    }
    Object.keys(query).forEach(key => {
      if (query[key] !== undefined && query[key] !== '') {
        url.searchParams.set(key, query[key]);
      }
    });
    const { json } = await baseHttpClient(url.toString());
    return { data: json.results || json, total: json.count || json.length };
  },
  getOne: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const url = `${API_URL}/${endpoint}/${params.id}/`;
    const { json } = await baseHttpClient(url);
    return { data: json };
  },
  getMany: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const queries = params.ids.map(id => baseHttpClient(`${API_URL}/${endpoint}/${id}/`).then(({ json }) => json));
    const data = await Promise.all(queries);
    return { data };
  },
  getManyReference: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = { ...params.filter, [params.target]: params.id };
    const url = new URL(`${API_URL}/${endpoint}/`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('page_size', String(perPage));
    if (field) {
      const ordering = order === 'DESC' ? `-${field}` : field;
      url.searchParams.set('ordering', ordering);
    }
    Object.keys(query).forEach(key => {
      if (query[key] !== undefined && query[key] !== '') {
        url.searchParams.set(key, query[key]);
      }
    });
    const { json } = await baseHttpClient(url.toString());
    return { data: json.results || json, total: json.count || json.length };
  },
  create: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const url = `${API_URL}/${endpoint}/`;
    if (resource === 'productos') {
      const { imagen_principal, imagenes, ...productData } = params.data;
      const { json: newProduct } = await baseHttpClient(url, { method: 'POST', body: productData });
      const newProductId = newProduct.id;
      if (!newProductId) throw new Error('No se pudo obtener el ID del nuevo producto.');
      const imageUploadPromises = [];
      const imageUrl = `${API_URL}/${resourceMap['imagenes-producto']}/`;
      const principalFormData = convertImageToFormData(imagen_principal, 'imagen');
      if (principalFormData) {
         principalFormData.append('producto', newProductId);
         principalFormData.append('es_principal', true);
         imageUploadPromises.push(baseHttpClient(imageUrl, { method: 'POST', body: principalFormData }));
      }
      if (imagenes && Array.isArray(imagenes)) {
        const newImages = imagenes.filter(img => img.rawFile);
        for (const image of newImages) {
          const adicionalFormData = convertImageToFormData(image, 'imagen');
          if (adicionalFormData) {
             adicionalFormData.append('producto', newProductId);
             adicionalFormData.append('es_principal', false);
             imageUploadPromises.push(baseHttpClient(imageUrl, { method: 'POST', body: adicionalFormData }));
          }
        }
      }
      await Promise.all(imageUploadPromises);
      return { data: newProduct };
    }
    const hasImageField = params.data.imagen && params.data.imagen.rawFile;
    if (hasImageField) {
        const formData = new FormData();
        Object.keys(params.data).forEach(key => {
            if (key === 'imagen' && params.data[key].rawFile) {
                 formData.append(key, params.data[key].rawFile);
            } else if (params.data[key] !== undefined && params.data[key] !== null) {
                 formData.append(key, params.data[key]);
            }
        });
        const { json } = await baseHttpClient(url, { method: 'POST', body: formData });
        return { data: json };
    } else {
         const { json } = await baseHttpClient(url, { method: 'POST', body: params.data });
         return { data: json };
    }
  },

  update: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const url = `${API_URL}/${endpoint}/${params.id}/`;

    if (resource === 'productos') {
        const { imagen_principal, imagenes, ...productData } = params.data;
        const productoId = params.id;
        const { json: updatedProduct } = await baseHttpClient(url, { method: 'PUT', body: productData });

        const imageUploadPromises = [];
        const imageUrl = `${API_URL}/${resourceMap['imagenes-producto']}/`;
        if (imagen_principal && imagen_principal.rawFile) {
           const principalFormData = convertImageToFormData(imagen_principal, 'imagen');
           if (principalFormData) {
               principalFormData.append('producto', productoId);
               principalFormData.append('es_principal', true);
               imageUploadPromises.push(baseHttpClient(imageUrl, { method: 'POST', body: principalFormData }));
           }
        }
        if (imagenes && Array.isArray(imagenes)) {
           const newImages = imagenes.filter(img => img.rawFile);
           for (const image of newImages) {
             const adicionalFormData = convertImageToFormData(image, 'imagen');
             if (adicionalFormData) {
                 adicionalFormData.append('producto', productoId);
                 adicionalFormData.append('es_principal', false);
                 imageUploadPromises.push(baseHttpClient(imageUrl, { method: 'POST', body: adicionalFormData }));
             }
           }
        }
        await Promise.all(imageUploadPromises);
        return { data: updatedProduct };
    }

    const { json } = await baseHttpClient(url, { method: 'PUT', body: params.data });
    return { data: json };
  },

  delete: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const url = `${API_URL}/${endpoint}/${params.id}/`;
    await baseHttpClient(url, { method: 'DELETE' });
    return { data: params.previousData };
  },
  deleteMany: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const queries = params.ids.map(id => baseHttpClient(`${API_URL}/${endpoint}/${id}/`, { method: 'DELETE' }));
    await Promise.all(queries);
    return { data: params.ids };
  },
  updateMany: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const queries = params.ids.map(id => baseHttpClient(`${API_URL}/${endpoint}/${id}/`, { method: 'PATCH', body: params.data }));
    await Promise.all(queries);
    return { data: params.ids };
  },
};

export default dataProvider;