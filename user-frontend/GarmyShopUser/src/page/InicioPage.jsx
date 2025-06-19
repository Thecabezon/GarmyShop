import React from 'react'; 
import { Link } from 'react-router-dom';
import '../styles/Inicio.css';

export function InicioPage() {
  return (
    <div className="inicio-container">

      {/* HERO BANNER - Full width y contenido centrado */}
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

      {/* Sección de Categorías Populares */}
      <section className="featured-categories py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Categorías Populares</h2>
          <div className="categories-grid">
            <div className="category-card">
              <img src="https://tissini.com/blog/wp-content/uploads/2022/07/vestidos-de-verano-para-mujer-disenos-en-tendencia.jpg" alt="Vestidos"/>
              <div className="category-info">
                <Link to="/categoria/vestidos" className="categoria-button">Ver Vestidos</Link> 
              </div>
            </div>
            <div className="category-card">
              <img src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/6ac8df30-8015-480e-8529-6f917715753c.__CR0,0,970,600_PT0_SX970_V1___.jpg" alt="Pantalones"/>
               <div className="category-info">
                <Link to="/categoria/pantalones" className="categoria-button">Ver Pantalones</Link>
               </div>
            </div>
            <div className="category-card">
              <img src="https://elricostore.com/wp-content/uploads/2022/05/manga-larga-blanco.png" alt="Polos"/>
               <div className="category-info">
                <Link to="/categoria/polos" className="categoria-button">Ver Polos</Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Productos Destacados */}
      <section className="featured-products py-5"> 
        <div className="container">
          <h2 className="text-center mb-4">Productos Destacados</h2>
          <div className="products-grid">
            <div className="product-card">
              <img src="https://img.kwcdn.com/product/1e78ea3018/b84a3b4f-9a36-46d0-9590-7baeb555912a_1340x1785.jpeg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp" alt="Vestido Floral"/>
              <div className="product-info">
                <h3>Vestido Floral</h3>
                <p>S/. 129.90</p>
                <Link to="/tienda/codigo-vestido-floral" className="product-button">Ver Detalle</Link>
              </div>
            </div>
            <div className="product-card">
              <img src="https://img.kwcdn.com/product/fancy/82e84b64-8c02-4ebd-8c71-cd75dd93dfd8.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp" alt="Chaqueta Denim"/>
              <div className="product-info">
                <h3>Chaqueta Denim</h3>
                <p>S/. 159.90</p>
                <Link to="/tienda/codigo-chaqueta-denim" className="product-button">Ver Detalle</Link>
              </div>
            </div>
            <div className="product-card">
              <img src="https://static-abcblogs.abc.es/wp-content/uploads/sites/203/2017/10/botones-diferencia.jpg" alt="Camisa Elegante"/>
              <div className="product-info">
                <h3>Camisa Elegante</h3>
                <p>S/. 89.90</p>
                <Link to="/tienda/codigo-camisa-elegante" className="product-button">Ver Detalle</Link>
              </div>
            </div>
            <div className="product-card">
              <img src="https://www.taisprincess.com.pe/wp-content/uploads/2024/01/1691131300ef57a879a01fe3b30da143c95e21c735_thumbnail_600x.jpg" alt="Vestido Casual"/>
              <div className="product-info">
                <h3>Vestido Casual</h3>
                <p>S/. 119.90</p>
                <Link to="/tienda/codigo-vestido-casual" className="product-button">Ver Detalle</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
