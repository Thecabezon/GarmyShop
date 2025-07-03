
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Inicio.css';
import { RopaComponente } from '../components/RopaComponente';
import { useData } from '../context/DataContext';

export function InicioPage({ handleAddToCart, handleToggleFavorite, favoriteItems }) {
  
  const { products, loading, error } = useData();

  const destacados = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.slice(0, 4); 
  }, [products]);


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
            isLiked={favoriteItems.some(item => item.id === producto.id)}
            handleAddToCart={handleAddToCart}
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
                <p className="lead mb-4">Descubre las últimas colecciones y expresa tu estilo único con Gamyshop.</p>
                <div className="d-grid gap-3 d-sm-flex">
                  <Link to="/tienda" className="btn btn-outline-light btn-lg px-4">Ver Colección</Link>
                  <Link to="/promociones" className="btn btn-outline-light btn-lg px-4">Promociones</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-categories py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Categorías Populares</h2>
          <div className="categories-grid">
            <div className="category-card">
              <img src="https://tissini.com/blog/wp-content/uploads/2022/07/vestidos-de-verano-para-mujer-disenos-en-tendencia.jpg" alt="Vestidos"/>
              <div className="category-info">
                <Link to="/tienda?categoria=2" className="categoria-button">Ver Vestidos</Link>
              </div>
            </div>
            <div className="category-card">
              <img src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/6ac8df30-8015-480e-8529-6f917715753c.__CR0,0,970,600_PT0_SX970_V1___.jpg" alt="Pantalones"/>
               <div className="category-info">
                <Link to="/tienda?categoria=1" className="categoria-button">Ver Pantalones</Link>
               </div>
            </div>
            <div className="category-card">
              <img src="https://elricostore.com/wp-content/uploads/2022/05/manga-larga-blanco.png" alt="Polos"/>
               <div className="category-info">
                <Link to="/tienda?categoria=3" className="categoria-button">Ver Polos</Link>
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
    </div>
  );
}