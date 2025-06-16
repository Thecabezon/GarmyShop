// dataProvider.js
import { fetchUtils } from 'react-admin';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'; // Sin barra al final

// Función auxiliar para obtener el valor de una cookie por nombre
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

// Mapeo de recursos a endpoints de Django
const resourceMap = {
  categorias: 'categorias',
  marcas: 'marcas',
  tallas: 'tallas',
  colores: 'colores',
  productos: 'productos', // Productos tiene lógica especial para múltiples imágenes
  'imagenes-producto': 'imagenes-producto', // Endpoint para imágenes de producto individuales
  'combinaciones-producto': 'combinaciones-producto',
  direcciones: 'direcciones',
  ordenes: 'ordenes',
  'orden-items': 'orden-items',
  usuarios: 'users',
};

// Cliente HTTP base que añade cookies y CSRF token para métodos de cambio de estado
const baseHttpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }

  const method = options.method ? options.method.toUpperCase() : 'GET';

  // Añadir el CSRF token solo para métodos que cambian el estado
  if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
     const csrfToken = getCookie('csrftoken');
     if (csrfToken) {
         options.headers.set('X-CSRFToken', csrfToken); // <-- AÑADIR LA CABECERA AQUÍ
     } else {
         console.warn(`CSRF token not found for ${method} ${url}. Request might fail.`);
         // O lanzar un error si quieres
         // throw new Error('CSRF token not available for state-changing request.');
     }
  }

  options.credentials = 'include';  // Enviar cookies de sesión

  // fetchUtils.fetchJson maneja la cabecera Content-Type automáticamente
  // si el body es FormData, de lo contrario usa 'application/json' por defecto.
  // No necesitamos establecer Content-Type aquí si el body es FormData.
  // Si el body es JSON, fetchUtils.fetchJson lo establecerá correctamente.
  // Si el body es FormData, fetchUtils.fetchJson NO DEBE establecer Content-Type
  // a application/json.

  // Si el body es un objeto y NO es FormData, asumimos que es JSON
  if (typeof options.body === 'object' && !(options.body instanceof FormData)) {
      options.headers.set('Content-Type', 'application/json');
      options.body = JSON.stringify(options.body);
  }
  // Si el body es FormData, NO establecemos Content-Type, el navegador lo hará.

  return fetchUtils.fetchJson(url, options);
};


// Convierte imagen de React Admin a FormData para subir archivos
// (Esta función crea FormData para *un solo* archivo de imagen)
const convertImageToFormData = (image, fieldName = 'imagen') => {
  if (!image || !image.rawFile) {
    return null;
  }
  const formData = new FormData();
  formData.append(fieldName, image.rawFile); // Añade el archivo File al FormData
  // Puedes añadir otros campos aquí si son necesarios para la subida de UNA imagen simple
  // ej: formData.append('some_other_field', image.some_other_prop);
  return formData;
};

const dataProvider = {
  // getList, getOne, getMany, getManyReference usan baseHttpClient con método GET -> No necesitan CSRF
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
    // Usa baseHttpClient para GET
    const { json } = await baseHttpClient(url.toString());
    return {
      data: json.results || json, // DRF PageNumberPagination devuelve { count, next, previous, results }
      total: json.count || json.length,
    };
  },

  getOne: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const url = `${API_URL}/${endpoint}/${params.id}/`;
    // Usa baseHttpClient para GET
    const { json } = await baseHttpClient(url);
    return { data: json };
  },

  getMany: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    // Las llamadas map usan baseHttpClient individualmente, todas serán GET
    const queries = params.ids.map(id =>
      baseHttpClient(`${API_URL}/${endpoint}/${id}/`).then(({ json }) => json)
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
    // Usa baseHttpClient para GET
    const { json } = await baseHttpClient(url.toString());
    return {
      data: json.results || json, // DRF PageNumberPagination devuelve { count, next, previous, results }
      total: json.count || json.length,
    };
  },

  // create y update necesitan lógica especial para manejar FormData para recursos con imágenes
  create: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const url = `${API_URL}/${endpoint}/`;

    // Lógica especial para productos con múltiples imágenes
    if (resource === 'productos') {
      const { imagen_principal, imagenes, ...productData } = params.data;
      const productEndpoint = resourceMap.productos;
      const productUrl = `${API_URL}/${productEndpoint}/`;

      // 1. Crear el producto sin las imágenes principales/adicionales
      // Asegúrate de que tu serializer de Producto en Django permite crear sin la imagen principal
      // o que la imagen principal es Null=True, Blank=True
      const { json: newProduct } = await baseHttpClient(productUrl, {
        method: 'POST',
        body: productData, // baseHttpClient hará JSON.stringify
      });

      const newProductId = newProduct.id;
      if (!newProductId) {
        throw new Error('No se pudo obtener el ID del nuevo producto después de crearlo.');
      }

      const imageUploadPromises = [];
      const imageUrl = `${API_URL}/${resourceMap['imagenes-producto']}/`; // Endpoint para ImagenProducto

      // 2. Subir la imagen principal (si existe)
      const principalFormData = convertImageToFormData(imagen_principal, 'imagen'); // Usa 'imagen' como nombre del campo file
      if (principalFormData) {
         principalFormData.append('producto', newProductId); // Añadir la relación al producto
         principalFormData.append('es_principal', true); // Marcar como principal
         // Usa baseHttpClient con body: FormData -> añadirá CSRF, NO Content-Type: application/json
         imageUploadPromises.push(
            baseHttpClient(imageUrl, { method: 'POST', body: principalFormData })
         );
      }

      // 3. Subir imágenes adicionales (si existen y son nuevos archivos)
      if (imagenes && Array.isArray(imagenes)) {
        const newImages = imagenes.filter(img => img.rawFile); // Filtrar solo los archivos nuevos
        for (const image of newImages) {
          const adicionalFormData = convertImageToFormData(image, 'imagen'); // Usa 'imagen' como nombre del campo file
          if (adicionalFormData) {
             adicionalFormData.append('producto', newProductId); // Añadir la relación al producto
             adicionalFormData.append('es_principal', false); // Marcar como adicional
             // Usa baseHttpClient con body: FormData -> añadirá CSRF, NO Content-Type: application/json
            imageUploadPromises.push(
              baseHttpClient(imageUrl, { method: 'POST', body: adicionalFormData })
            );
          }
        }
      }

      await Promise.all(imageUploadPromises);

      // Devuelve el producto creado o haz un getOne para la versión completa con imágenes relacionadas
      return { data: newProduct }; // O { data: { ...params.data, id: newProductId } } si prefieres los datos originales
      // return await dataProvider.getOne(resource, { id: newProductId }); // Opción para obtener el objeto completo del backend
    }

    // Lógica general para crear recursos (incluyendo categorías)
    // Verifica si el recurso tiene un campo de imagen que se sube (ej: 'imagen' en categorías)
    // Deberías adaptar esta lógica si otros recursos tienen subida de archivos
    const hasImageField = (params.data.imagen && (params.data.imagen.rawFile || typeof params.data.imagen === 'string')); // Check if 'imagen' field exists and is file or URL

    if (hasImageField && params.data.imagen.rawFile) {
        // Si hay un NUEVO archivo de imagen en el campo 'imagen' (para categorías u otros que lo tengan)
        const formData = new FormData();
        // Añadir otros campos del formulario a FormData
        Object.keys(params.data).forEach(key => {
            if (key === 'imagen' && params.data[key].rawFile) {
                // Añade el archivo real si es el campo 'imagen' y es un archivo nuevo
                 formData.append(key, params.data[key].rawFile);
            } else if (params.data[key] !== undefined && params.data[key] !== null) {
                // Añade otros campos. Maneja booleanos si es necesario (FormData los convierte a 'true'/'false' string)
                 formData.append(key, params.data[key]);
            }
        });

        // Usa baseHttpClient con body: FormData -> añadirá CSRF, NO Content-Type: application/json
        const { json } = await baseHttpClient(url, {
            method: 'POST',
            body: formData, // <-- Enviar FormData
        });
        return { data: json }; // Backend debe retornar el objeto creado
    } else {
        // Si no hay un archivo nuevo para subir (ej: creando sin imagen, o un recurso sin campo de imagen)
        // Usa baseHttpClient con body: JSON (asumirá Content-Type: application/json)
         const { json } = await baseHttpClient(url, {
            method: 'POST',
            body: params.data, // <-- Enviar JSON (baseHttpClient lo stringify)
        });
        return { data: json }; // Backend debe retornar el objeto creado
    }
  },


  update: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const url = `${API_URL}/${endpoint}/${params.id}/`;

    // Lógica especial para productos con múltiples imágenes (similar a create pero usando PUT/PATCH)
    if (resource === 'productos') {
        const { imagen_principal, imagenes, ...productData } = params.data;
        const productoId = params.id;
        const productUrl = `${API_URL}/${resourceMap.productos}/${productoId}/`;

        // 1. Actualizar el producto principal (sin manejar imágenes aquí)
        // baseHttpClient con method: 'PUT' -> añadirá CSRF, body: JSON
        const { json: updatedProduct } = await baseHttpClient(productUrl, {
            method: 'PUT', // O PATCH si prefieres
            body: productData,
        });

        const imageUploadPromises = [];
        const imageUrl = `${API_URL}/${resourceMap['imagenes-producto']}/`; // Endpoint para ImagenProducto

        // Lógica para manejar imágenes en la actualización de productos:
        // Esto solo sube *nuevas* imágenes si tienen rawFile.
        // NO maneja el BORRADO de imágenes existentes que fueron eliminadas en el formulario de RA.
        // Si necesitas borrar, tendrías que identificar qué imágenes existentes faltan en 'imagenes' y hacer DELETEs.

        // 2. Subir/actualizar imagen principal (si hay un nuevo archivo)
        if (imagen_principal && imagen_principal.rawFile) {
           // Nota: Esta lógica asume que subir una nueva imagen principal con POST a /imagenes-producto/
           // y marcarla como principal, maneja correctamente el reemplazo o la marcación en el backend.
           // Tu backend para ImagenProducto POST debería manejar si ya hay una imagen principal para este producto.
           const principalFormData = convertImageToFormData(imagen_principal, 'imagen'); // Usa 'imagen' como nombre del campo file
           if (principalFormData) {
               principalFormData.append('producto', productoId);
               principalFormData.append('es_principal', true);
               // Usa baseHttpClient con body: FormData -> añadirá CSRF, NO Content-Type: application/json
               imageUploadPromises.push(
                  baseHttpClient(imageUrl, { method: 'POST', body: principalFormData })
               );
           }
        }

        // 3. Subir nuevas imágenes adicionales (si existen y son archivos nuevos)
        if (imagenes && Array.isArray(imagenes)) {
           const newImages = imagenes.filter(img => img.rawFile); // Filtrar solo los archivos nuevos
           for (const image of newImages) {
             const adicionalFormData = convertImageToFormData(image, 'imagen'); // Usa 'imagen' como nombre del campo file
             if (adicionalFormData) {
                 adicionalFormData.append('producto', productoId);
                 adicionalFormData.append('es_principal', false);
                 // Usa baseHttpClient con body: FormData -> añadirá CSRF, NO Content-Type: application/json
                imageUploadPromises.push(
                  baseHttpClient(imageUrl, { method: 'POST', body: adicionalFormData })
                );
             }
           }
        }

        await Promise.all(imageUploadPromises);

        // Devuelve el producto actualizado o haz un getOne
        return { data: updatedProduct };
        // return await dataProvider.getOne(resource, { id: productoId }); // Opción para obtener el objeto completo del backend
    }

    // Lógica general para actualizar recursos (incluyendo categorías)
    // Verifica si el recurso tiene un campo de imagen que se sube (ej: 'imagen' en categorías)
    // Deberías adaptar esta lógica si otros recursos tienen subida de archivos
     const hasImageField = (params.data.imagen !== undefined); // Check if 'imagen' field is in the data

     // Si el campo 'imagen' existe en los datos Y tiene un archivo nuevo O es null/undefined (para borrar la existente)
     // ImageInput en React Admin envía { rawFile: File, src: 'blob:...' } para un nuevo archivo
     // Envía { src: 'url_existente', title: 'nombre' } para una imagen existente que no se cambió
     // Envía null si la imagen existente fue borrada en el formulario
    if (hasImageField) {
        if (params.data.imagen && params.data.imagen.rawFile) {
            // Caso 1: Se subió un nuevo archivo de imagen
            const formData = new FormData();
             // Añadir otros campos del formulario a FormData
            Object.keys(params.data).forEach(key => {
                if (key === 'imagen' && params.data[key].rawFile) {
                    // Añade el archivo real si es el campo 'imagen' y es un archivo nuevo
                     formData.append(key, params.data[key].rawFile);
                } else if (params.data[key] !== undefined && params.data[key] !== null) {
                    // Añade otros campos. Maneja booleanos si es necesario
                     formData.append(key, params.data[key]);
                }
            });

            // Usa baseHttpClient con body: FormData -> añadirá CSRF, NO Content-Type: application/json
             const { json } = await baseHttpClient(url, {
                method: 'PUT', // O PATCH si prefieres
                body: formData, // <-- Enviar FormData
            });
            return { data: json }; // Backend debe retornar el objeto actualizado
        } else if (params.data.imagen === null) {
             // Caso 2: La imagen existente fue borrada en el formulario
             // Necesitas enviar un valor que tu backend interprete como "borrar imagen",
             // típicamente enviando null o una cadena vacía para el campo imagen en JSON.
             // Tu serializer y ViewSet de Django deben manejar esto.
             const dataToSend = { ...params.data, imagen: null }; // Explicitamente establecer a null
             // Usa baseHttpClient con body: JSON
             const { json } = await baseHttpClient(url, {
                method: 'PUT', // O PATCH
                body: dataToSend, // <-- Enviar JSON con imagen: null
             });
             return { data: json };
        }
         // Case 3: El campo 'imagen' existía pero no se subió un archivo nuevo (se dejó la existente)
         // React Admin enviará el objeto { src: 'url', title: '...' }.
         // En este caso, no queremos enviar un FormData. Queremos enviar el resto de datos como JSON.
         // Si el backend espera la URL o simplemente ignora el campo si no es un archivo,
         // puedes filtrar el campo 'imagen' o enviarlo como es si tu serializer lo acepta.
         // Lo más seguro es filtrar el campo 'imagen' si no hay un rawFile, para no enviar el objeto { src: url }
         // que puede causar un error JSON en el backend.
         const dataToSend = {};
         Object.keys(params.data).forEach(key => {
             if (key !== 'imagen') { // Excluir el campo imagen si no es un archivo nuevo
                 dataToSend[key] = params.data[key];
             } else if (params.data[key] && !params.data[key].rawFile) {
                 // Si es el campo imagen pero NO es un rawFile (es una URL existente),
                 // podrías opcionalmente enviarla como URL string si tu backend lo necesita explícitamente
                 // dataToSend[key] = params.data[key].src; // Esto podría ser necesario dependiendo del backend
             }
         });
         // Asegurarnos de enviar otros campos si no se tocó la imagen
         const { json } = await baseHttpClient(url, {
            method: 'PUT', // O PATCH
            body: dataToSend, // <-- Enviar JSON sin el objeto imagen { src: ... }
         });
         return { data: json };
    }


    // Si el recurso no tiene campo de imagen o el campo imagen no está en los datos enviados
    // Usa baseHttpClient con body: JSON
     const { json } = await baseHttpClient(url, {
        method: 'PUT', // O PATCH
        body: params.data, // <-- Enviar JSON
     });
    return { data: json }; // Backend debe retornar el objeto actualizado
  },

  // delete usa baseHttpClient con método DELETE -> NECESITA CSRF
  delete: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    const url = `${API_URL}/${endpoint}/${params.id}/`;
    // baseHttpClient con method: 'DELETE' -> añadirá CSRF
    await baseHttpClient(url, { method: 'DELETE' });
    return { data: params.previousData };
  },

  // deleteMany usa baseHttpClient con método DELETE -> NECESITA CSRF
  deleteMany: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    // Las llamadas map usan baseHttpClient individualmente, todas serán DELETE
    const queries = params.ids.map(id =>
      // baseHttpClient con method: 'DELETE' -> añadirá CSRF
      baseHttpClient(`${API_URL}/${endpoint}/${id}/`, { method: 'DELETE' })
    );
    await Promise.all(queries);
    return { data: params.ids };
  },

  // updateMany usa baseHttpClient con método PATCH -> NECESITA CSRF
  updateMany: async (resource, params) => {
    const endpoint = resourceMap[resource] || resource;
    // Las llamadas map usan baseHttpClient individualmente, todas serán PATCH
    const queries = params.ids.map(id =>
      // baseHttpClient con method: 'PATCH' -> añadirá CSRF
      baseHttpClient(`${API_URL}/${endpoint}/${id}/`, {
        method: 'PATCH',
        body: params.data, // baseHttpClient lo stringify
      })
    );
    await Promise.all(queries);
    return { data: params.ids };
  },
};

export default dataProvider;