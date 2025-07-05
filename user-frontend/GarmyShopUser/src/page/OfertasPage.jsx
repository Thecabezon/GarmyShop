import React, { useState, useEffect } from 'react';
import { RopaComponente } from '../components/RopaComponente';
import '../styles/OfertasPage.css';
import { API_BASE_URL } from '../config/apiConfig';


const API_OFERTAS_URL = `${API_BASE_URL}/api/productos`; 

export const OfertasPage = ({ handleAddToCart }) => {
    const [productosEnOferta, setProductosEnOferta] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOfertas = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(API_OFERTAS_URL);

                if (!response.ok || response.status === 204) {
                    if (response.status === 204) {
                        console.warn("API returned 204 No Content. No products to display.");
                        setProductosEnOferta([]);
                    } else {
                        const errorText = await response.text();
                        throw new Error(`HTTP error! status: ${response.status} - ${errorText || response.statusText}`);
                    }
                } else {
                    const data = await response.json();

                    if (!Array.isArray(data)) {
                        console.error("API did not return an array:", data);
                        throw new Error("Formato de datos de API inesperado.");
                    }

                    const filteredOfertas = data.filter(producto =>
                        producto.precioOferta != null && 
                        typeof producto.precioOferta === 'number' && 
                        producto.precio != null && 
                        typeof producto.precio === 'number' && 
                        parseFloat(producto.precioOferta) < parseFloat(producto.precio) &&
                        producto.esActivo === 1
                    );
                    setProductosEnOferta(filteredOfertas);
                }

            } catch (err) {
                setError(err.message);
                console.error("Error fetching offers:", err);
                setProductosEnOferta([]);
            } finally {
                setLoading(false);
                window.scrollTo(0, 0);
            }
        };

        fetchOfertas();
    }, []);

    if (loading) {
        return <div className="page-status"><h1>Cargando ofertas...</h1></div>;
    }

    if (error) {
        return <div className="page-status"><h1>Error al cargar ofertas: {error}</h1></div>;
    }

    if (productosEnOferta.length === 0 && !loading && !error) {
        return <div className="page-status"><h1>No hay ofertas disponibles en este momento.</h1></div>;
    }

    return (
        <div className="ofertas-page-container">
            <h1 className="ofertas-title">Ofertas Imperdibles</h1>
            <div className="ofertas-grid">
                {productosEnOferta.map(producto => (
                    <RopaComponente
                        key={producto.id}
                        producto={producto}
                        handleAddToCart={handleAddToCart}
                    />
                ))}
            </div>
        </div>
    );
};