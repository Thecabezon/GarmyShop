import { fetchUtils } from 'react-admin';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'; // Sin la barra al final

/**
 * httpClient para peticiones que envían JSON.
 * Agrega el token de autenticación y el header 'Content-Type'.
 */
const jsonHttpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  options.headers.set('Content-Type', 'application/json');
  
  const token = localStorage.getItem('auth_token');
  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }
  
  return fetchUtils.fetchJson(url, options);
};

/**
 * httpClient para peticiones que envían archivos (FormData).
 * Agrega solo el token, deja que el navegador establezca el Content-Type.
 */
const formDataHttpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('auth_token');
    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    }
    return fetchUtils.fetchJson(url, options);
};


// Mapeo de recursos a endpoints de Django
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


/**
 * Función auxiliar para convertir el objeto de imagen de React-Admin
 * en un objeto FormData que la API puede entender.
 */
const convertImageToFormData = (image, productoId, esPrincipal = false) => {
  // rawFile es la propiedad que React-Admin añade al objeto de imagen
  if (!image || !image.rawFile) {
    return null;
  }
  
  const formData = new FormData();
  // El nombre 'imagen' debe coincidir con el campo en tu ImagenProductoSerializer
  formData.append('imagen', image.rawFile); 
  formData.append('producto', productoId);
  formData.append('es_principal', esPrincipal);
  
  return formData;
};


const dataProvider = {
  // --- MÉTODOS GET (sin cambios) ---
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
    const { json } = await jsonHttpClient(url.toString());
    return {
      data: json.results || json,
      total: json.count || json.length,
    };
  },
  getOne: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const url = `${API_URL}/${endpoint}/${params.id}/`;
    const { json } = await jsonHttpClient(url);
    return { data: json };
  },
  getMany: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const queries = params.ids.map(id => 
      jsonHttpClient(`${API_URL}/${endpoint}/${id}/`).then(({ json }) => json)
    );
    const data = await Promise.all(queries);
    return { data };
  },
  getManyReference: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      ...params.filter,
      [params.target]: params.id,
    };
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
    const { json } = await jsonHttpClient(url.toString());
    return {
      data: json.results || json,
      total: json.count || json.length,
    };
  },

  // --- MÉTODOS DE ESCRITURA (MODIFICADOS) ---

  // 🟦 MÉTODO CREATE ACTUALIZADO 🟦
  create: async (resource, params) => {
    // Si el recurso no es 'productos', usamos la lógica por defecto
    if (resource !== 'productos') {
      const endpoint = resourceMap[resource] || resource;
      const url = `${API_URL}/${endpoint}/`;
      const { json } = await jsonHttpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: json };
    }

    // --- LÓGICA ESPECIAL PARA CREAR PRODUCTOS ---
    
    // 1. Separar los datos del producto de los datos de las imágenes
    const { imagen_principal, imagenes, ...productData } = params.data;
    
    // 2. Crear el producto principal (sin las imágenes)
    const productEndpoint = resourceMap.productos;
    const productUrl = `${API_URL}/${productEndpoint}/`;
    const { json: newProduct } = await jsonHttpClient(productUrl, {
      method: 'POST',
      body: JSON.stringify(productData),
    });

    const newProductId = newProduct.id;
    if (!newProductId) {
      throw new Error('No se pudo obtener el ID del nuevo producto.');
    }

    // 3. Preparar las promesas para subir las imágenes
    const imageUploadPromises = [];
    const imageUrl = `${API_URL}/${resourceMap['imagenes-producto']}/`;

    // Subir la imagen principal
    const principalFormData = convertImageToFormData(imagen_principal, newProductId, true);
    if (principalFormData) {
        imageUploadPromises.push(
            formDataHttpClient(imageUrl, { method: 'POST', body: principalFormData })
        );
    }
    
    // Subir las imágenes adicionales
    if (imagenes && imagenes.length > 0) {
      for (const image of imagenes) {
        const adicionalFormData = convertImageToFormData(image, newProductId, false);
        if (adicionalFormData) {
            imageUploadPromises.push(
                formDataHttpClient(imageUrl, { method: 'POST', body: adicionalFormData })
            );
        }
      }
    }

    // 4. Ejecutar todas las promesas de subida
    await Promise.all(imageUploadPromises);
    
    // 5. Devolver el producto recién creado (con su ID) para que React-Admin pueda redirigir
    return { data: { ...params.data, id: newProductId } };
  },

  // 🟪 MÉTODO UPDATE ACTUALIZADO 🟪
  update: async (resource, params) => {
    // Si el recurso no es 'productos', usamos la lógica por defecto
    if (resource !== 'productos') {
        const endpoint = resourceMap[resource] || resource;
        const url = `${API_URL}/${endpoint}/${params.id}/`;
        const { json } = await jsonHttpClient(url, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        });
        return { data: json };
    }

    // --- LÓGICA ESPECIAL PARA ACTUALIZAR PRODUCTOS ---
    const { imagen_principal, imagenes, ...productData } = params.data;
    const productoId = params.id;

    // 1. Actualizar los datos del producto
    const productUrl = `${API_URL}/${resourceMap.productos}/${productoId}/`;
    const { json: updatedProduct } = await jsonHttpClient(productUrl, {
        method: 'PUT', // o PATCH si tu API lo soporta
        body: JSON.stringify(productData),
    });
    
    // 2. Subir las nuevas imágenes
    // NOTA: Esta lógica simple solo AÑADE imágenes, no borra ni reemplaza las antiguas.
    // Reemplazar imágenes requeriría una lógica mucho más compleja o cambios en la API.
    const imageUploadPromises = [];
    const imageUrl = `${API_URL}/${resourceMap['imagenes-producto']}/`;

    // Solo sube si es una imagen nueva (tiene .rawFile)
    if (imagen_principal && imagen_principal.rawFile) {
        // ¡ADVERTENCIA! Esto AÑADIRÁ una nueva imagen principal, no reemplazará la antigua.
        console.warn("Actualizar imagen principal: se está añadiendo una nueva, no reemplazando la existente.");
        const principalFormData = convertImageToFormData(imagen_principal, productoId, true);
        if (principalFormData) {
            imageUploadPromises.push(
                formDataHttpClient(imageUrl, { method: 'POST', body: principalFormData })
            );
        }
    }

    if (imagenes && imagenes.length > 0) {
        const newImages = imagenes.filter(img => img.rawFile); // Filtra solo las nuevas
        for (const image of newImages) {
            const adicionalFormData = convertImageToFormData(image, productoId, false);
            if (adicionalFormData) {
                imageUploadPromises.push(
                    formDataHttpClient(imageUrl, { method: 'POST', body: adicionalFormData })
                );
            }
        }
    }
    
    await Promise.all(imageUploadPromises);

    return { data: updatedProduct };
  },

  // --- MÉTODOS DELETE (sin cambios) ---

  delete: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const url = `${API_URL}/${endpoint}/${params.id}/`;
    await jsonHttpClient(url, { method: 'DELETE' });
    return { data: params.previousData };
  },

  deleteMany: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const queries = params.ids.map(id =>
        jsonHttpClient(`${API_URL}/${endpoint}/${id}/`, { method: 'DELETE' })
    );
    await Promise.all(queries);
    return { data: params.ids };
  },
  
  // No hemos modificado updateMany, seguirá sin funcionar para imágenes.
  updateMany: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const queries = params.ids.map(id =>
      jsonHttpClient(`${API_URL}/${endpoint}/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(params.data),
      })
    );
    await Promise.all(queries);
    return { data: params.ids };
  },
};

export default dataProvider;