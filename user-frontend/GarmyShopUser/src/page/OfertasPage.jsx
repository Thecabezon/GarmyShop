// src/pages/OfertasPage.jsx
import React, { useState, useEffect } from 'react';
// CAMBIA ESTA LÍNEA: Importa RopaComponente
import { RopaComponente } from '../components/RopaComponente'; // Asegúrate que la importación coincide con tu exportación
import '../styles/OfertasPage.css';
// Asumo que tienes un contexto o función global para añadir al carrito
// import { useCart } from '../context/CartContext'; // Ejemplo si usas contexto
// o recibes handleAddToCart como prop desde App.js

// Simula la URL de la API para obtener productos (ajusta según tu backend)
// Idealmente, tu backend tendría un endpoint específico para ofertas:
const API_OFERTAS_URL = 'http://localhost:8085/api/productos'; // O '/api/productos/en-oferta' si existe

export const OfertasPage = ({ handleAddToCart }) => { // Recibe handleAddToCart si no usas contexto
    const [productosEnOferta, setProductosEnOferta] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOfertas = async () => {
            setLoading(true);
            setError(null); // Limpiar errores previos al iniciar el fetch
            try {
                const response = await fetch(API_OFERTAS_URL);

                // Es buena práctica verificar también estados 2xx que puedan retornar cuerpo vacío, como 204 No Content
                if (!response.ok || response.status === 204) {
                     // Si la respuesta no es exitosa O es 204 No Content
                    if (response.status === 204) {
                        console.warn("API returned 204 No Content. No products to display.");
                        setProductosEnOferta([]); // No hay productos, establecer a array vacío
                    } else {
                        // Si es otro código de error
                        const errorText = await response.text(); // Intentar leer el cuerpo como texto para más info
                        throw new Error(`HTTP error! status: ${response.status} - ${errorText || response.statusText}`);
                    }
                } else {
                     // Si la respuesta es exitosa (ej. 200 OK)
                    const data = await response.json();

                    // *** AÑADE ESTA VERIFICACIÓN ***
                    if (!Array.isArray(data)) {
                        console.error("API did not return an array:", data);
                        throw new Error("Formato de datos de API inesperado.");
                    }

                    // Filtrar productos que están en oferta (precioOferta < precio y activo)
                    // Asegúrate de que 'esActivo' se llama así en tu API, si no, ajusta
                    const filteredOfertas = data.filter(producto =>
                        producto.precioOferta != null && // Asegura que el campo existe
                        typeof producto.precioOferta === 'number' && // Asegura que es un número
                        producto.precio != null && // Asegura que el precio normal existe
                        typeof producto.precio === 'number' && // Asegura que es un número
                        parseFloat(producto.precioOferta) < parseFloat(producto.precio) && // Comparar como números
                        producto.esActivo === 1 // O como se llame el campo de activo/disponible (asumo 1 para activo)
                    );

                    // Opcional: Formatear los productos filtrados si es necesario (ej: añadir URL completa de imagen)
                    // Si tu componente RopaComponente ya maneja CLOUDINARY_BASE_URL, esto quizás no es necesario aquí.
                    // const formattedOfertas = filteredOfertas.map(p => ({
                    //     ...p,
                    //     imagenPrincipalUrl: p.imagenes?.find(img => img.esPrincipal)?.imagen
                    //         ? `${CLOUDINARY_BASE_URL}/${p.imagenes.find(img => img.esPrincipal).imagen}`
                    //         : 'https://dummyimage.com/400x400/f0f0f0/ccc&text=No+Imagen'
                    // }));


                    setProductosEnOferta(filteredOfertas); // O formattedOfertas si formateaste
                }

            } catch (err) {
                setError(err.message);
                console.error("Error fetching offers:", err);
                setProductosEnOferta([]); // En caso de error, mostrar array vacío para no romper la UI
            } finally {
                setLoading(false);
                window.scrollTo(0, 0); // Scroll al inicio al cargar la página
            }
        };

        fetchOfertas();
    }, []); // El array vacío asegura que se ejecuta una sola vez al montar

    if (loading) {
        return <div className="page-status"><h1>Cargando ofertas...</h1></div>;
    }

    // Mostrar el error si existe
    if (error) {
        return <div className="page-status"><h1>Error al cargar ofertas: {error}</h1></div>;
    }

    // Si no hay loading ni error, y la lista está vacía
    if (productosEnOferta.length === 0 && !loading && !error) {
        return <div className="page-status"><h1>No hay ofertas disponibles en este momento.</h1></div>;
    }

    return (
        <div className="ofertas-page-container">
            <h1 className="ofertas-title">Ofertas Imperdibles</h1>
            <div className="ofertas-grid">
                {productosEnOferta.map(producto => (
                    // CAMBIA ESTO: Usa RopaComponente
                    <RopaComponente
                        key={producto.id}
                        producto={producto} // Pasa el objeto completo del producto
                        handleAddToCart={handleAddToCart} // Pasa la función para añadir al carrito
                         // Otros props que RopaComponente necesite (ej: para abrir modal, si aplica)
                         // handleOpenModal={handleOpenModal} // Si tienes una función para abrir el modal de detalle rápido
                         // isLiked={...} // Si necesitas pasar el estado de favorito aquí
                         // handleToggleFavorite={...} // Si el botón de favorito está en la tarjeta
                    />
                ))}
            </div>
        </div>
    );
};