// Importamos los hooks y componentes necesarios
import { useState } from 'react'; // Aunque no se usa ahora, podría servir para un futuro slider
import { Link } from 'react-router-dom'; // Para navegación interna sin recargar la página
import '../styles/Inicio.css'; // Importamos los estilos personalizados para esta página

// Componente principal de la página de inicio
export function InicioPage() {
  return (
    <div className="inicio-container">
      {/* Hero Banner */}
      <section
        className="hero-banner text-white py-5" // Eliminamos bg-dark si el background-image ya lo oscurece
        style={{
          background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.20)), url("https://numero.com/wp-content/uploads/2025/02/blackpink-tournee-mondiale-retour-musique.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          display: 'flex', // Añadido display: flex aquí para centrar verticalmente el contenido del container
          alignItems: 'center', // Añadido alignItems: center para centrar verticalmente el contenido del container
        }}
      >
        <div className="container">
          <div className="row">
            {/* Usamos col-12 para ocupar todo el ancho en mobile, y col-lg-8 en pantallas grandes */}
            {/* La clase original era col-16 col-lg-8, col-16 no es una clase estándar de Bootstrap, probablemente querías col-12 */}
            <div className="col-12 col-lg-8">
              <h1 className="fw-bold mb-4">La Moda Que Te Define</h1> {/* Eliminamos display-4 si ya lo manejas en CSS */}
              <p className="lead mb-4">Descubre las últimas colecciones y expresa tu estilo único con Gamyshop.</p>
              <div className="d-grid gap-3 d-sm-flex">
                {/* Mantenemos las clases de Bootstrap para los botones CTA del hero */}
                <Link to="/tienda" className="btn btn-outline-light btn-lg px-4">Ver Colección</Link>
                <Link to="/promociones" className="btn btn-outline-light btn-lg px-4">Promociones</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Categorías Populares */}
      {/* Eliminamos bg-light si ya lo pones en CSS, pero lo dejo aquí como opción */}
      <section className="featured-categories py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Categorías Populares</h2>
          <div className="categories-grid">

            {/* Tarjeta para Vestidos */}
            <div className="category-card">
              <img
                //className="categoria-imagen" // Eliminamos si no tiene estilos específicos no compartidos
                src="https://tissini.com/blog/wp-content/uploads/2022/07/vestidos-de-verano-para-mujer-disenos-en-tendencia.jpg"
                alt="Vestidos"
              />
              {/* !!! CLAVE: Agregamos el div category-info alrededor del Link !!! */}
              <div className="category-info">
                <Link to="/categoria/vestidos" className="categoria-button">Ver Vestidos</Link> {/* Eliminamos mt-2, lo manejamos con margin-top: auto dentro de category-info */}
              </div>
            </div>

            {/* Tarjeta para Pantalones */}
            <div className="category-card">
              <img
                 //className="categoria-imagen" // Eliminamos si no tiene estilos específicos no compartidos
                src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/6ac8df30-8015-480e-8529-6f917715753c.__CR0,0,970,600_PT0_SX970_V1___.jpg"
                alt="Pantalones"
              />
              {/* !!! CLAVE: Agregamos el div category-info alrededor del Link !!! */}
               <div className="category-info">
                <Link to="/categoria/pantalones" className="categoria-button">Ver Pantalones</Link> {/* Eliminamos mt-2 */}
               </div>
            </div>

            {/* Tarjeta para Polos */}
            <div className="category-card">
              <img
                 //className="categoria-imagen" // Eliminamos si no tiene estilos específicos no compartidos
                src="https://elricostore.com/wp-content/uploads/2022/05/manga-larga-blanco.png"
                alt="Polos"
              />
               {/* !!! CLAVE: Agregamos el div category-info alrededor del Link !!! */}
               <div className="category-info">
                <Link to="/categoria/polos" className="categoria-button">Ver Polos</Link> {/* Eliminamos mt-2 */}
               </div>
            </div>

             {/* Ejemplo de otra categoría si tienes más */}
            {/*
            <div className="category-card">
              <img
                src="URL_IMAGEN_ACCESORIOS.jpg"
                alt="Accesorios"
              />
              <div className="category-info">
                 <Link to="/categoria/accesorios" className="categoria-button">Ver Accesorios</Link>
              </div>
            </div>
            */}

          </div>
        </div>
      </section>

      {/* Separación visual - Puedes usar un margen directamente en las secciones o en el container */}
      {/* <div className="my-5"></div> */} {/* Eliminamos este div si ya hay padding/margin */}


      {/* Sección de Productos Destacados */}
      <section className="featured-products py-5"> {/* Dejamos py-5 de Bootstrap para el padding */}
        <div className="container">
          <h2 className="text-center mb-4">Productos Destacados</h2>
          <div className="products-grid">
            {/* Producto 1 */}
            <div className="product-card">
              <img
                src="https://img.kwcdn.com/product/1e78ea3018/b84a3b4f-9a36-46d0-9590-7baeb555912a_1340x1785.jpeg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp"
                alt="Vestido Floral"
              />
              <div className="product-info">
                <h3>Vestido Floral</h3>
                <p>S/. 129.90</p>
                {/* Usamos la clase custom product-button. Eliminamos mt-2 aquí también */}
                <Link to="/tienda/codigo-vestido-floral" className="product-button">Ver Detalle</Link>
              </div>
            </div>

            {/* Producto 2 */}
            <div className="product-card">
              <img
                src="https://img.kwcdn.com/product/fancy/82e84b64-8c02-4ebd-8c71-cd75dd93dfd8.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp"
                alt="Chaqueta Denim"
              />
              <div className="product-info">
                <h3>Chaqueta Denim</h3>
                <p>S/. 159.90</p>
                 {/* Usamos la clase custom product-button */}
                <Link to="/tienda/codigo-chaqueta-denim" className="product-button">Ver Detalle</Link>
              </div>
            </div>

            {/* Producto 3 */}
            <div className="product-card">
              <img
                src="https://static-abcblogs.abc.es/wp-content/uploads/sites/203/2017/10/botones-diferencia.jpg"
                alt="Camisa Elegante"
              />
              <div className="product-info">
                <h3>Camisa Elegante</h3>
                <p>S/. 89.90</p>
                 {/* Usamos la clase custom product-button */}
                <Link to="/tienda/codigo-camisa-elegante" className="product-button">Ver Detalle</Link>
              </div>
            </div>

            {/* Producto 4 */}
            <div className="product-card">
              <img
                src="https://www.taisprincess.com.pe/wp-content/uploads/2024/01/1691131300ef57a879a01fe3b30da143c95e21c735_thumbnail_600x.jpg"
                alt="Vestido Casual"
              />
              <div className="product-info">
                <h3>Vestido Casual</h3>
                <p>S/. 119.90</p>
                 {/* Usamos la clase custom product-button */}
                <Link to="/tienda/codigo-vestido-casual" className="product-button">Ver Detalle</Link>
              </div>
            </div>

             {/* Agrega más productos si es necesario */}

          </div>
        </div>
      </section>

       {/* Sección de Beneficios - (No mostrada en la imagen original, pero mantenida) */}
       {/*
        <section className="benefits">
           // ... contenido de beneficios ...
        </section>
       */}

    </div>
  );
}