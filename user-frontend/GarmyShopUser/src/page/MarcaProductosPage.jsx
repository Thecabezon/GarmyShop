// src/page/MarcaProductosPage.jsx (ACTUALIZADO PARA USAR EL CONTEXT)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext'; // <-- Importamos useData
import { RopaComponente } from '../components/RopaComponente';
import { ProductModal } from '../components/ProductModal';
import '../styles/Tienda.css';
import '../styles/MarcasPage.css';

const API_BASE_URL = 'https://garmyshop-user-backend.onrender.com/api';

const MarcaProductosPage = ({ handleAddToCart, favoriteItems, handleToggleFavorite }) => {
    const { slug } = useParams();
    const { getProductsByMarcaSlug } = useData(); // <-- Obtenemos la nueva función del contexto

    const [marca, setMarca] = useState(null);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para el modal (sin cambios)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        const fetchDatosDeMarca = async () => {
            if (!slug) return;
            
            setLoading(true);
            setError(null);
            
            try {
                // Usamos la función del contexto. ¡Adiós al fetch repetitivo!
                const { productos: fetchedProductos, marca: fetchedMarca } = await getProductsByMarcaSlug(slug);
                setProductos(fetchedProductos);
                setMarca(fetchedMarca);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDatosDeMarca();
        window.scrollTo(0, 0);
    }, [slug, getProductsByMarcaSlug]); // Añadimos getProductsByMarcaSlug a las dependencias

    // Lógica del modal (idéntica, no cambia)
    const handleOpenModal = async (producto) => {
        setIsModalOpen(true);
        setModalLoading(true);
        setSelectedProduct({ nombre: "Cargando..." });
        try {
            const response = await fetch(`${API_BASE_URL}/productos/${producto.id}`);
            if (!response.ok) throw new Error('No se pudieron cargar los detalles.');
            const productoCompleto = await response.json();
            setSelectedProduct(productoCompleto);
        } catch (err) {
            console.error("Error al obtener detalles del producto para el modal:", err);
            alert('Hubo un error al cargar el producto.');
            setIsModalOpen(false);
        } finally {
            setModalLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    // La lógica de renderizado no cambia
    if (loading) {
        return <div className="page-status"><h1>Cargando productos de la marca...</h1></div>;
    }
    if (error) {
        return (
            <div className="page-status error">
                <h1>Error</h1>
                <p>{error}</p>
                <Link to="/marcas" className="primary-button">Volver a Marcas</Link>
            </div>
        );
    }
    
    return (
        <div className="productos-container">
            {marca && (
                <div className="marcas-titulo-section">
                    <h2 className="titulo-marcas">Productos de {marca.nombre}</h2>
                    <div className="linea-decorativa"></div>
                </div>
            )}
            
            {productos.length > 0 ? (
                <div className="ropa-lista">
                    {productos.map(producto => (
                        <RopaComponente
                            key={producto.id}
                            producto={producto}
                            isLiked={favoriteItems.some(item => item.id === producto.id)}
                            handleOpenModal={() => handleOpenModal(producto)}
                            handleToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </div>
            ) : (
                <div className="no-results-message">
                    <h3>No hay productos</h3>
                    <p>Actualmente no tenemos productos disponibles para esta marca.</p>
                </div>
            )}

            <ProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                producto={selectedProduct}
                onAddToCart={handleAddToCart}
                isLoading={modalLoading}
            />
        </div>
    );
};

export default MarcaProductosPage;