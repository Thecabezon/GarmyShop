// src/page/InicioPage.jsx
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Inicio.css';
import { RopaComponente } from '../components/RopaComponente';
import { useData } from '../context/DataContext';
import { ProductModal } from '../components/ProductModal';

export function InicioPage({ handleAddToCart, handleToggleFavorite, favoriteItems }) {
  const { products, loading, error } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const destacados = useMemo(() => {
    if (!products || !Array.isArray(products) || products.length === 0) return [];
    return products.slice(0, 4);
  }, [products]);

  const handleOpenModal = async (producto) => {
      setModalLoading(true);
      setIsModalOpen(true);
      setSelectedProduct({...producto, nombre: "Cargando..."});
      try {
          const response = await fetch(`http://localhost:8085/api/productos/${producto.id}`);
          if (!response.ok) {
               const errorBody = await response.text();
               console.error(`Error fetching product details for modal (HTTP ${response.status}): ${errorBody}`);
               throw new Error(`No se pudieron cargar los detalles. Código: ${response.status}`);
           }
          const productoCompleto = await response.json();

          if (!productoCompleto || !productoCompleto.combinacionesDisponibles) {
               throw new Error('Faltan datos de combinaciones en la respuesta del producto.');
          }

          setSelectedProduct(productoCompleto);
      } catch (err) {
          console.error("Error fetching product details for modal:", err);
          alert('Hubo un error al cargar los detalles del producto: ' + err.message);
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


  const renderFeaturedProducts = () => {
    if (loading) {
      return <p>Cargando productos destacados...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>Error: {error}</p>;
    }
    if (destacados.length === 0) {
      return <p>No hay productos destacados en este momento.</p>;
    }
    return (
      <div className="products-grid">
        {destacados.map(producto => (
          <RopaComponente
            key={producto.id}
            producto={producto}
            isLiked={favoriteItems?.some(item => item.id === producto.id)}
            handleOpenModal={() => handleOpenModal(producto)}
            handleToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="inicio-container">
      <section className="hero-banner text-white py-5">
        <div className="hero-inner">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-8">
                <h1 className="fw-bold mb-4">La Moda Que Te Define</h1>
                <p className="lead mb-4">Descubre las últimas tendencias en moda y expresa tu estilo único con Gamyshop.</p>
                <div className="d-grid gap-3 d-sm-flex">
                  <Link to="/tienda" className="btn btn-outline-light btn-lg px-4">Ver Tienda</Link>
                  <Link to="/marcas" className="btn btn-outline-light btn-lg px-4">Ver marcas</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-products py-5">
        <div className="container">
          <h2 className="text-center mb-4">Productos Destacados</h2>
          {renderFeaturedProducts()}
        </div>
      </section>

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