import React from 'react'; // Si tienes un linter, puede que necesites React
import '../styles/Tienda.css';
import { productos } from '../data/productos'; // <-- 1. IMPORTA la fuente de datos principal
import { Link } from 'react-router-dom'; // <-- 2. IMPORTA Link para una mejor navegación

export function TiendaPage({ handleAddToCart }) {
  // const ropas = [ ... ]; // <-- 3. ELIMINA o comenta el array estático 'ropas'

  return (
    <div className="productos-container">
      <h2 className="productos-titulo">Nuestros Productos</h2>
      <div className="ropa-lista">
        {/* 4. Mapea sobre 'productos' importados, no sobre 'ropas' */}
        {productos.map((producto) => (
          <div key={producto.cod} className="ropa-card">
            <div className="ropa-imagen">
              <img src={producto.imagen} alt={producto.nombre} />
            </div>
            <div className="ropa-info">
              <h5>{producto.nombre}</h5>
              {/* Usa 'tipoPrenda' que es lo que tienes en productos.js */}
              <p className="producto-categoria">{producto.tipoPrenda}</p>
              <div className="ropa-precio">
                <span className="precio-actual">S/. {producto.precio.toFixed(2)}</span>
              </div>
              <div className="botones-fila">
                <button onClick={() => handleAddToCart(producto)} className="agregar-carrito-btn">
                  {/* ... tu SVG del carrito ... */}
                  Agregar al carrito
                </button>

                {/* 5. USA <Link> EN LUGAR DE window.location.href */}
                {/* Esto es más rápido y es la forma correcta de navegar en React Router */}
                <Link to={`/tienda/${producto.cod}`} className="ver-detalle-btn" aria-label="Ver detalle" title="Ver detalle">
                  {/* ... tu SVG del ojo ... */}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// No necesitas 'export default' si ya usas 'export function'