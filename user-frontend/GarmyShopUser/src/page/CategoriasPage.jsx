import { useState } from 'react';
import '../styles/Categorias.css';

const CategoriasPage = () => {
  const [categorias] = useState([
    {
        id: 1,
        nombre: "Polos",
        descripcion: "Encuentra los mejores polos para tu estilo",
        imagen: "https://elricostore.com/wp-content/uploads/2022/05/manga-larga-blanco.png"
      },
      {
        id: 2,
        nombre: "Pantalones",
        descripcion: "Variedad de pantalones para cada ocasión",
        imagen: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/6ac8df30-8015-480e-8529-6f917715753c.__CR0,0,970,600_PT0_SX970_V1___.jpg"
      },
      {
        id: 3,
        nombre: "Faldas",
        descripcion: "Faldas con diseños exclusivos",
        imagen: "https://i.pinimg.com/originals/fa/a6/03/faa603c4da9748094b22c076d0b89c20.jpg"
      },
      {
        id: 4,
        nombre: "Vestidos",
        descripcion: "Vestidos para toda ocasión",
        imagen: "https://tissini.com/blog/wp-content/uploads/2022/07/vestidos-de-verano-para-mujer-disenos-en-tendencia.jpg"
      },
      {
        id: 5,
        nombre: "Casacas",
        descripcion: "Casacas para mantenerte abrigado con estilo",
        imagen: "https://ae01.alicdn.com/kf/S76cde18f804d426aadbd0200ef2ebefd3/Men-s-Down-Jacket-Warm-Winter-Men-Down-Jacket-Designer-Clothes-Men-Duck-Down-Padding-Jackets.jpg"
      },
      {
        id: 6,
        nombre: "Shorts",
        descripcion: "Shorts cómodos y a la moda",
        imagen: "https://us.123rf.com/450wm/opolja/opolja1808/opolja180800166/106720334-grupo-de-amigos-divirti%C3%A9ndose-corriendo-por-la-playa-al-atardecer.jpg?ver=6"
      },
      {
        id: 7,
        nombre: "Chaquetas",
        descripcion: "Chaquetas elegantes para completar tu look",
        imagen: "https://casacasdecuero.pe/storage/2022/01/CAZADORAS-DE-CUERO-PARA-HOMBRES-2022-3.jpg"
      },
      {
        id: 8,
        nombre: "Pijamas",
        descripcion: "Pijamas cómodos para tu descanso",
        imagen: "https://i5.walmartimages.com/asr/7801d9c6-2881-4cda-a517-88600d646206.5e5c710e330347867aa113b73462ed1c.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF"
      },
      {
        id: 9,
        nombre: "Camisas",
        descripcion: "Camisas para un look formal o casual",
        imagen: "https://static-abcblogs.abc.es/wp-content/uploads/sites/203/2017/10/botones-diferencia.jpg"
      }
    ]);

  const handleVerProductos = (categoriaId) => {
    window.location.href = `/tienda?categoria=${categoriaId}`;
  };

  return (
    <div className="categorias-container">
      <h2>Nuestras Categorías</h2>
      <div className="categorias-grid">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="categoria-card">
            <div className="categoria-imagen">
              <img src={categoria.imagen} alt={categoria.nombre} />
            </div>
            <div className="categoria-contenido">
              <h3>{categoria.nombre}</h3>
              <p>{categoria.descripcion}</p>
              <button 
                onClick={() => handleVerProductos(categoria.id)}
                className="ver-productos-btn"
              >
                Ver Productos
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriasPage;