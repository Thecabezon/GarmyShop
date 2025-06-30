
import React, { useState, useEffect } from 'react';
import '../styles/Tienda.css';
import { ProductModal } from '../components/ProductModal';
import { RopaComponente } from '../components/RopaComponente';

export function TiendaPage({ handleAddToCart, favoriteItems, handleToggleFavorite }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8085/api/productos');
        if (!response.ok) {
          throw new Error('La respuesta de la red no fue correcta. Revisa si la API está encendida.');
        }
        const data = await response.json();
        setProductos(data.content); 
      } catch (error) {
        setError(error.message);
        console.error("Error al obtener los productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const handleOpenModal = async (producto) => {
    if (producto.combinacionesDisponibles) {
      setSelectedProduct(producto);
      setIsModalOpen(true);
      return;
    }

    setModalLoading(true);
    setIsModalOpen(true);
    setSelectedProduct({ nombre: "Cargando..." });

    try {
      const response = await fetch(`http://localhost:8085/api/productos/${producto.id}`);
      if (!response.ok) {
        throw new Error('No se pudieron cargar los detalles del producto.');
      }
      const productoCompleto = await response.json();
      setSelectedProduct(productoCompleto);
    } catch (err) {
      console.error("Error al obtener detalles para el modal:", err);
      alert('Hubo un error al cargar el producto. Por favor, inténtalo de nuevo.');
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

  if (loading) {
    return <div className="productos-container"><h2 className="productos-titulo">Cargando productos...</h2></div>;
  }

  if (error) {
    return <div className="productos-container"><h2 className="productos-titulo" style={{color: 'red'}}>Error: {error}</h2></div>;
  }

  return (
    <div className="productos-container">
      <h2 className="productos-titulo">Nuestros Productos</h2>
      <div className="ropa-lista">
        {productos.map((producto) => {
          const isLiked = favoriteItems.some(item => item.id === producto.id);
          return (
            <RopaComponente
              key={producto.id}
              producto={producto}
              isLiked={isLiked}
              handleOpenModal={handleOpenModal}
              handleToggleFavorite={handleToggleFavorite}
            />
          );
        })}
      </div>

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