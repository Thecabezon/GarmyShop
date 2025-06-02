import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Inicio.css';

export function InicioPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="inicio-container">
      {/* Hero Section con Slider */}
      <section className="hero-slider">
        <div className="slide-container">
          <div className="slide">
            <img 
              src="https://www.dangelashoes.com/blog/wp-content/uploads/2020/12/DANGELA-COLECCION-FW-20_21.jpg" 
              alt="Nueva Colección" 
            />
            <div className="slide-content">
              <h2>Nueva Colección</h2>
              <p>Descubre las últimas tendencias</p>
              <Link to="/tienda" className="cta-button">Ver Ahora</Link>
            </div>
          </div>
        </div>
      </section>

    {/* Categorías Destacadas */}
    <section className="featured-categories">
      <h2>Categorías Populares</h2>
      <div className="categories-grid">
        <div className="category-card">
          <img 
            className="categoria-imagen"
            src="https://tissini.com/blog/wp-content/uploads/2022/07/vestidos-de-verano-para-mujer-disenos-en-tendencia.jpg" 
            alt="Vestidos" 
          />
          <a href="#" className="categoria-boton">Vestidos</a>
        </div>
        <div className="category-card">
          <img 
            className="categoria-imagen"
            src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/6ac8df30-8015-480e-8529-6f917715753c.__CR0,0,970,600_PT0_SX970_V1___.jpg" 
            alt="Pantalones" 
          />
          <a href="#" className="categoria-boton">Pantalones</a>
        </div>
        <div className="category-card">
          <img 
            className="categoria-imagen"
            src="https://elricostore.com/wp-content/uploads/2022/05/manga-larga-blanco.png" 
            alt="Polos" 
          />
          <a href="#" className="categoria-boton">Polos</a>
        </div>
      </div>
    </section>

      {/* Productos Destacados */}
      <section className="featured-products">
        <h2>Productos Destacados</h2>
        <div className="products-grid">
          <div className="product-card">
            <img 
              src="https://img.kwcdn.com/product/1e78ea3018/b84a3b4f-9a36-46d0-9590-7baeb555912a_1340x1785.jpeg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp" 
              alt="Vestido Floral" 
            />
            <div className="product-info">
              <h3>Vestido Floral</h3>
              <p>S/. 129.90</p>
              <button className="product-button">Ver Detalle</button>
            </div>
          </div>
          <div className="product-card">
            <img 
              src="https://img.kwcdn.com/product/fancy/82e84b64-8c02-4ebd-8c71-cd75dd93dfd8.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp"
              alt="Chaqueta Denim" 
            />
            <div className="product-info">
              <h3>Chaqueta Denim</h3>
              <p>S/. 159.90</p>
              <button className="product-button">Ver Detalle</button>
            </div>
          </div>
          <div className="product-card">
            <img 
              src="https://static-abcblogs.abc.es/wp-content/uploads/sites/203/2017/10/botones-diferencia.jpg" 
              alt="Camisa Elegante" 
            />
            <div className="product-info">
              <h3>Camisa Elegante</h3>
              <p>S/. 89.90</p>
              <button className="product-button">Ver Detalle</button>
            </div>
          </div>
          <div className="product-card">
            <img 
              src="https://www.taisprincess.com.pe/wp-content/uploads/2024/01/1691131300ef57a879a01fe3b30da143c95e21c735_thumbnail_600x.jpg"
              alt="Vestido Casual" 
            />
            <div className="product-info">
              <h3>Vestido Casual</h3>
              <p>S/. 119.90</p>
              <button className="product-button">Ver Detalle</button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <h2>No te pierdas nuestras promociones!</h2>
        <p>Recibe las últimas novedades y ofertas exclusivas</p>
        <form className="newsletter-form">
          <input type="email" placeholder="Tu correo electrónico" />
          <button type="submit">Suscribirse</button>
        </form>
      </section>
    </div>
  );
}