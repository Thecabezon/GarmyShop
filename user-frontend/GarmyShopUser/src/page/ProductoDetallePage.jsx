import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productos } from '../data/productos';
import RecomendacionesCarousel from '../components/RecomendacionesCarousel';
import '../styles/ProductoDetalle.css';

// Plantilla para detalles genéricos (esto está bien aquí)
const detallesPlantilla = {
  imagenesAdicionales: ["https://i.imgur.com/cE59y2H.png", "https://i.imgur.com/aLp4b4W.png", "https://i.imgur.com/N6vaAas.png"],
  tallasDisponibles: [{ talla: 'S', disponible: true }, { talla: 'M', disponible: true }, { talla: 'L', disponible: false }, { talla: 'XL', disponible: true }],
  coloresDisponibles: [{ nombre: 'Negro', codigoHex: '#000000' }, { nombre: 'Blanco', codigoHex: '#ffffff' }, { nombre: 'Gris', codigoHex: '#808080' }, { nombre: 'Azul', codigoHex: '#0000ff' }],
  detalles: "Composición: 95% Algodón, 5% Elastano. Cuidado: Lavar a máquina con agua fría.",
  infoEnvio: "Envío estándar de 3 a 5 días hábiles. Devoluciones gratuitas."
};

export const ProductoDetallePage = ({ handleAddToCart }) => {
  // === PASO 1: DECLARACIÓN DE ESTADOS Y HOOKS ===
  // Todo lo que necesita el componente para "recordar" cosas va aquí arriba.
  const { cod } = useParams();
  const [productoActual, setProductoActual] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('descripcion');

  // === PASO 2: LÓGICA DE EFECTOS (useEffect) ===
  // Código que se ejecuta cuando algo cambia (en este caso, el 'cod' de la URL).
  useEffect(() => {
    const productoEncontrado = productos.find(p => p.cod === parseInt(cod, 10));

    if (productoEncontrado) {
      const productoCompleto = {
        ...productoEncontrado,
        sku: `SKU-${productoEncontrado.cod}`,
        imagenes: [productoEncontrado.imagen, ...detallesPlantilla.imagenesAdicionales],
        tallasDisponibles: detallesPlantilla.tallasDisponibles,
        coloresDisponibles: detallesPlantilla.coloresDisponibles,
        detalles: detallesPlantilla.detalles,
        infoEnvio: detallesPlantilla.infoEnvio,
      };
      setProductoActual(productoCompleto);
      setSelectedImage(productoCompleto.imagen);
      setSelectedSize(null);
      setSelectedColor(null);
      setQuantity(1);
      window.scrollTo(0, 0);
    } else {
      setProductoActual(null);
    }
  }, [cod]);

  // === PASO 3: MANEJADORES DE EVENTOS (Handlers) ===
  // Funciones que se ejecutan cuando el usuario hace algo (clic, etc.).
  const handleAddToCartClick = () => {
    if (!productoActual) return; // Seguridad extra
    if (!selectedSize) { alert("Por favor, selecciona una talla."); return; }
    if (!selectedColor) { alert("Por favor, selecciona un color."); return; }
    const itemToAdd = {
      ...productoActual,
      talla: selectedSize,
      color: selectedColor,
      cantidad: quantity,
      idUnicoCarrito: `${productoActual.cod}-${selectedSize}-${selectedColor.nombre}`
    };
    handleAddToCart(itemToAdd);
    alert(`${productoActual.nombre} (${selectedSize}, ${selectedColor.nombre}) ha sido añadido al carrito.`);
  };

  // === PASO 4: GUARDIA DE RENDERIZADO ===
  // Si no tenemos el producto aún, no seguimos ejecutando el resto del código.
  if (!productoActual) {
    return <div className="producto-detalle-container"><h1>Producto no encontrado</h1></div>;
  }

  // === PASO 5: LÓGICA DE DATOS PARA EL RENDERIZADO ===
  // Ahora que sabemos que `productoActual` existe, podemos calcular las recomendaciones.
  // Esta función SOLO se llama si `productoActual` no es null.
  const getProductosRecomendados = () => {
    // console.log("Calculando recomendaciones para:", productoActual.nombre); // Puedes descomentar para depurar
    const recomendados = productos
      .filter(p => p.cod !== productoActual.cod)
      .map(p => {
        let score = 0;
        if (p.tipoPrenda.includes(productoActual.tipoPrenda) || productoActual.tipoPrenda.includes(p.tipoPrenda)) score += 10;
        if (p.marca === productoActual.marca) score += 5;
        if (productoActual.combinaCon && productoActual.combinaCon.some(tipo => p.tipoPrenda.includes(tipo))) score += 8;
        if (p.combinaCon && p.combinaCon.some(tipo => productoActual.tipoPrenda.includes(tipo))) score += 8;
        return { ...p, score };
      })
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
    // console.log(">>>> RESULTADO FINAL:", recomendados); // Puedes descomentar para depurar
    return recomendados;
  };
// const productosRecomendados = getProductosRecomendados(); // Comentamos la lógica compleja
const productosRecomendados = productos.slice(0, 4); // Forzamos mostrar los primeros 4 productos de la lista

  // === PASO 6: RENDERIZADO FINAL (return JSX) ===
  // Aquí va todo el HTML que se mostrará en la página.
  return (
    <div className="producto-detalle-container">
      {/* Columna Izquierda: Galería de Imágenes */}
      <div className="product-gallery">
        <img src={selectedImage} alt={productoActual.nombre} className="main-image" />
        <div className="thumbnail-container">
          {productoActual.imagenes.map((img, index) => (
            <img key={index} src={img} alt={`Thumbnail ${index + 1}`}
              className={selectedImage === img ? 'thumbnail active' : 'thumbnail'}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Columna Derecha: Información y Acciones */}
      <div className="product-info">
        <h1>{productoActual.nombre}</h1>
        <div className="price-section">
          <span className="current-price">S/. {productoActual.precio.toFixed(2)}</span>
        </div>
        <div className="options-section">
          <div className="size-selector">
            <p>Talla:</p>
            <div className="options-buttons">
              {productoActual.tallasDisponibles.map(talla => (
                <button key={talla.talla} className={`size-btn ${selectedSize === talla.talla ? 'active' : ''}`} disabled={!talla.disponible} onClick={() => setSelectedSize(talla.talla)}>
                  {talla.talla}
                </button>
              ))}
            </div>
          </div>
          <div className="color-selector">
            <p>Colores Disponibles:</p>
            <div className="options-buttons">
              {productoActual.coloresDisponibles.map(color => (
                <div key={color.nombre} className={`color-swatch ${selectedColor?.nombre === color.nombre ? 'active' : ''}`}
                  style={{ backgroundColor: color.codigoHex, border: color.codigoHex === '#ffffff' ? '1px solid #ccc' : 'none' }}
                  onClick={() => setSelectedColor(color)} title={color.nombre}>
                </div>
              ))}
            </div>
          </div>
          <div className="quantity-selector">
            <p>Cantidad:</p>
            <div className="quantity-input">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <input type="number" value={quantity} readOnly />
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          </div>
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCartClick}>AGREGAR AL CARRITO</button>
        <p className="sku-info">SKU: {productoActual.sku}</p>
        <div className="product-description-tabs">
          <div className="tab-headers">
            <button className={activeTab === 'descripcion' ? 'active' : ''} onClick={() => setActiveTab('descripcion')}>DESCRIPCIÓN</button>
            <button className={activeTab === 'detalles' ? 'active' : ''} onClick={() => setActiveTab('detalles')}>DETALLE</button>
            <button className={activeTab === 'envio' ? 'active' : ''} onClick={() => setActiveTab('envio')}>ENVÍO</button>
          </div>
          <div className="tab-content">
            {activeTab === 'descripcion' && <p>{productoActual.descripcion}</p>}
            {activeTab === 'detalles' && <p>{productoActual.detalles}</p>}
            {activeTab === 'envio' && <p>{productoActual.infoEnvio}</p>}
          </div>
        </div>
      </div>

      {/* Sección de Recomendados */}
      {productosRecomendados && productosRecomendados.length > 0 ? (
        <div className="recommendations-section">
          <h2>TAMBIÉN TE PODRÍA INTERESAR</h2>
          <RecomendacionesCarousel productos={productosRecomendados} />
        </div>
      ) : (
        <div className="recommendations-section">
          <h2>TAMBIÉN TE PODRÍA INTERESAR</h2>
          <p>No se encontraron productos recomendados.</p>
        </div>
      )}
    </div>
  );
};