import RopaComponente from "../components/RopaComponente";
import '../styles/Tienda.css';
export function TiendaPage({ handleAddToCart }) {
const ropas = [
  {
    cod: 1,
    nombre: "Camisa",
    descripcion: "Camisa de algodón",
    categoria: "Hombre",
    precio: 20.0,
    imagen: "https://oechsle.vteximg.com.br/arquivos/ids/19954465/imageUrl_1.jpg?v=638679871644900000"
  },
  {
    cod: 2,
    nombre: "Pantalón",
    descripcion: "Pantalón de mezclilla",
    categoria: "Mujer",
    precio: 35.0,
    imagen: "https://i5-mx.walmartimages.com/mg/gm/3pp/asr/c7d1ca57-5ca7-4719-9f2e-b39cfcc7523e.b2a9fb89801c5151a3ee9be32d57e185.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF"
  },
  {
    cod: 3,
    nombre: "Chaqueta",
    descripcion: "Chaqueta de cuero",
    categoria: "Mujer",
    precio: 50.0,
    imagen: "https://img.kwcdn.com/product/fancy/82e84b64-8c02-4ebd-8c71-cd75dd93dfd8.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp"
  },
  {
    cod: 4,
    nombre: "Vestido",
    descripcion: "Vestido elegante",
    categoria: "Mujer",
    precio: 75.0,
    imagen: "https://www.atributo.co/cdn/shop/files/232.png?crop=center&height=803&v=1693517212&width=600"
  },
  {
    cod: 5,
    nombre: "pijamas",
    descripcion: "pijamas de algodón",
    categoria: "Unisex",
    precio: 60.0,
    imagen: "https://i5.walmartimages.com/asr/0045ee17-0bb6-4e9f-95b6-656bd3fa3c13.1d9536f7e1ce704368299c19bfe6adde.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF"
  },
  {
    cod: 6,
    nombre: "Falda",
    descripcion: "Falda casual",
    categoria: "Mujer",
    precio: 40.0,
    imagen: "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/4aa36d6a87303a356affab5c5271b91c.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp"
  },
  {
    cod: 7,
    nombre: "Camisa Formal",
    descripcion: "Camisa para oficina",
    categoria: "Hombre",
    precio: 30.0,
    imagen: "https://ss241.liverpool.com.mx/xl/1143867923.jpg"
  },
  {
    cod: 8,
    nombre: "Chaqueta Deportiva",
    descripcion: "Chaqueta para running",
    categoria: "Unisex",
    precio: 55.0,
    imagen: "https://images-na.ssl-images-amazon.com/images/I/51qCkBgTELL._AC_UL375_SR375,375_.jpg"
  },
  {
    cod: 9,
    nombre: "Pantalón Corto",
    descripcion: "Pantalón corto para verano",
    categoria: "Hombre",
    precio: 25.0,
    imagen: "https://img.kwcdn.com/product/fancy/a7b14dde-d561-4db2-846f-52e0e1f2d8c4.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp"
  }
];

    return(
      <div className="productos-container">
        <h2 className="productos-titulo">Nuestros Productos</h2>
        <div className="ropa-lista">
          {ropas.map((ropa) => (
            <div key={ropa.cod} className="ropa-card">
              <div className="ropa-imagen">
                <img src={ropa.imagen} alt={ropa.nombre} />
              </div>
              <div className="ropa-info">
                <h5>{ropa.nombre}</h5>
                <p className="producto-categoria">{ropa.categoria}</p>
                <div className="ropa-precio">
                  <span className="precio-actual">S/. {ropa.precio.toFixed(2)}</span>
                </div>
                <div className="botones-fila">
                  <button onClick={() => handleAddToCart(ropa)} className="agregar-carrito-btn" >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"
                      style={{ marginRight: '8px' }}
                    >
                      <path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                      <path d="M20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    Agregar al carrito
                  </button>

                  <button  onClick={() => window.location.href = `/tienda/${ropa.cod}`} className="ver-detalle-btn"
                    aria-label="Ver detalle"
                    title="Ver detalle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20" height="20"  fill="none" stroke="white"  strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};
    
