// src/pages/BusquedaPage.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RopaComponente } from '../components/RopaComponente';
import { ProductModal } from '../components/ProductModal';
import '../styles/BusquedaPage.css'; // Crearemos este archivo de estilos

export function BusquedaPage({ handleAddToCart, favoriteItems, handleToggleFavorite }) {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Hook para leer los parámetros de la URL, como "?query=chaqueta"
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  // Estados para el modal (reutilizados de TiendaPage)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Este useEffect se ejecuta cada vez que el término de búsqueda (query) en la URL cambia
  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://garmyshop-user-backend.onrender.com/api/productos/buscar?termino=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Error al buscar los productos.');
        }
        const data = await response.json();
        setSearchResults(data.content || []); // El backend devuelve un objeto Page
      } catch (err) {
        setError(err.message);
        console.error("Error en la búsqueda:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]); // Dependencia: se ejecuta de nuevo si `query` cambia

  // Lógica para abrir el modal (idéntica a TiendaPage)
  const handleOpenModal = async (producto) => {
    setModalLoading(true);
    setIsModalOpen(true);
    setSelectedProduct({ nombre: "Cargando..." });
    try {
        const response = await fetch(`https://garmyshop-user-backend.onrender.com/api/productos/${producto.id}`);
        if (!response.ok) throw new Error('No se pudieron cargar los detalles.');
        const productoCompleto = await response.json();
        setSelectedProduct(productoCompleto);
    } catch (err) {
        alert('Hubo un error al cargar el producto.');
        handleCloseModal();
    } finally {
        setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setModalLoading(false);
  };

  const renderContent = () => {
    if (loading) {
      return <p className="busqueda-mensaje">Buscando productos...</p>;
    }
    if (error) {
      return <p className="busqueda-mensaje error">Error: {error}</p>;
    }
    if (!query) {
      return <p className="busqueda-mensaje">Ingresa un término en la barra de búsqueda para comenzar.</p>;
    }
    if (searchResults.length === 0) {
      return (
        <div className="busqueda-mensaje no-results">
            <h3>No se encontraron resultados</h3>
            <p>No hay productos que coincidan con "<strong>{query}</strong>".</p>
            <p>Intenta con otras palabras o revisa la ortografía.</p>
        </div>
      );
    }
    return (
      // Reutilizamos la misma clase que en TiendaPage para los estilos de la grilla
      <div className="ropa-lista"> 
        {searchResults.map((producto) => (
          <RopaComponente
            key={producto.id}
            producto={producto}
            isLiked={favoriteItems.some(item => item.id === producto.id)}
            handleOpenModal={() => handleOpenModal(producto)}
            handleToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="busqueda-page-container">
      <h1 className="busqueda-titulo">
        Resultados de búsqueda para: <span>"{query}"</span>
      </h1>
      {renderContent()}

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        producto={selectedProduct}
        onAddToCart={handleAddToCart}
        isLoading={modalLoading}
      />
    </div>
  );
}