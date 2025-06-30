import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RecomendacionesCarousel from '../components/RecomendacionesCarousel';
import PriceDisplay from '../components/ofertas/PriceDisplay';
import '../styles/ProductoDetalle.css';
import { CLOUDINARY_BASE_URL } from '../config/cloudinary';

export const ProductoDetallePage = ({ handleAddToCart }) => {
  const { cod } = useParams();
  const [productoActual, setProductoActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('descripcion');
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [combinacionesDisponibles, setCombinacionesDisponibles] = useState([]);
  const [tallasDisponibles, setTallasDisponibles] = useState([]);
  const [coloresDisponibles, setColoresDisponibles] = useState([]);

  useEffect(() => {
    const fetchProductoDetalle = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8085/api/productos/${cod}`);
        if (!response.ok) throw new Error('Producto no encontrado.');
        const apiData = await response.json();

        const imagenPrincipalPath = apiData.imagenes.find(img => img.esPrincipal)?.imagen || apiData.imagenes[0]?.imagen;
        const fullImagenPrincipal = imagenPrincipalPath
          ? `${CLOUDINARY_BASE_URL}/${imagenPrincipalPath}`
          : 'https://dummyimage.com/600x600/f0f0f0/ccc&text=No+Imagen';

        const fullListaImagenes = apiData.imagenes.map(img => `${CLOUDINARY_BASE_URL}/${img.imagen}`);

        const hasOffer = apiData.precioOferta != null && apiData.precioOferta < apiData.precio;
        const displayPrice = hasOffer ? apiData.precioOferta : apiData.precio;
        const originalPrice = hasOffer ? apiData.precio : null;

        if (apiData.combinacionesDisponibles && apiData.combinacionesDisponibles.length > 0) {
          setCombinacionesDisponibles(apiData.combinacionesDisponibles);
          
          const tallas = [...new Set(apiData.combinacionesDisponibles
            .map(c => c.talla.nombre))]
            .map(nombreTalla => ({
              talla: nombreTalla,
              disponible: true
            }));
          setTallasDisponibles(tallas);
          
          const colores = apiData.combinacionesDisponibles
            .map(c => c.color)
            .filter((color, index, self) => 
              index === self.findIndex((c) => c.id === color.id)
            );
          setColoresDisponibles(colores);
        }

        const productoFormateado = {
          id: apiData.id,
          cod: apiData.id,
          nombre: apiData.nombre,
          precio: apiData.precio,
          precioOferta: apiData.precioOferta,
          displayPrice: displayPrice,
          originalPrice: originalPrice,
          sku: apiData.sku,
          descripcion: apiData.descripcion,
          imagenes: fullListaImagenes,
          combinacionesDisponibles: apiData.combinacionesDisponibles,
          detalles: "Fabricado con materiales de alta calidad para garantizar durabilidad y confort.",
          infoEnvio: "Envío estándar de 3-5 días hábiles. Devoluciones gratuitas dentro de los 30 días."
        };

        setProductoActual(productoFormateado);
        setSelectedImage(fullImagenPrincipal);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    fetchProductoDetalle();
  }, [cod]);

  
  const handleAddToCartClick = () => {
    if (!selectedSize) {
      alert("Por favor, selecciona una talla.");
      return;
    }
    if (!selectedColor) {
      alert("Por favor, selecciona un color.");
      return;
    }
  
    const combinacionSeleccionada = combinacionesDisponibles.find(
      c => c.talla.nombre === selectedSize && c.color.id === selectedColor.id
    );
  
    if (!combinacionSeleccionada) {
      alert("La combinación seleccionada no está disponible.");
      return;
    }
  
    const itemToAdd = {
      ...productoActual,
      id: productoActual.id,
      nombre: productoActual.nombre,
      talla: selectedSize,
      color: selectedColor,
      cantidad: quantity,
      quantity: quantity,
      price: productoActual.displayPrice,
      displayPrice: productoActual.displayPrice,
      precio: productoActual.precio,
      imagen: productoActual.imagenes?.[0] || '',
      idUnicoCarrito: `${productoActual.id}-${combinacionSeleccionada.id}`,
      combinacionProductoId: combinacionSeleccionada.id
    };
  
    handleAddToCart(itemToAdd);
    alert(`${productoActual.nombre} ha sido añadido al carrito.`);
  };

  if (loading) return <div className="page-status"><h1>Cargando...</h1></div>;
  if (error) return <div className="page-status"><h1>Error: {error}</h1></div>;
  if (!productoActual) return <div className="page-status"><h1>Producto no disponible.</h1></div>;

  return (
    <div className="detalle-page-container">
      <div className="product-layout">
        <div className="product-gallery-layout">
          <div className="thumbnail-list">
            {productoActual.imagenes.map((fullImgUrl, index) => (
              <div
                key={index}
                className={`thumbnail-item ${selectedImage === fullImgUrl ? 'active' : ''}`}
                onClick={() => setSelectedImage(fullImgUrl)}
              >
                <img src={fullImgUrl} alt={`Vista previa ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="main-image-container">
            <img src={selectedImage} alt={productoActual.nombre} className="main-image" />
          </div>
        </div>

        <div className="product-info-layout">
          <h1>{productoActual.nombre}</h1>
          <div className="price-section">
            <PriceDisplay 
                regularPrice={productoActual.precio} 
                offerPrice={productoActual.precioOferta} 
            />
          </div>
          <p className="product-short-description">
              {productoActual.descripcion?.length > 150 ?
                productoActual.descripcion.substring(0, 150) + '...' :
                productoActual.descripcion
              }
          </p>

          <div className="options-group">
            <div className="option-block">
              <label>Color</label>
              <div className="color-selector">
                {coloresDisponibles.map(color => (
                  <div
                    key={color.id}
                    title={color.nombre}
                    className={`color-swatch ${selectedColor?.id === color.id ? 'active' : ''}`}
                    style={{ backgroundColor: color.codigoHex }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
            <div className="option-block">
              <label>Talla</label>
              <div className="size-selector">
                {tallasDisponibles.map(talla => (
                  <button
                    key={talla.talla}
                    onClick={() => setSelectedSize(talla.talla)}
                    className={`size-btn ${selectedSize === talla.talla ? 'active' : ''}`}
                    disabled={!talla.disponible}
                  >
                    {talla.talla}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="actions-group">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <input type="text" value={quantity} readOnly />
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCartClick} disabled={!selectedSize || !selectedColor}>
              AGREGAR AL CARRITO
            </button>
          </div>

          <p className="sku-info">SKU: {productoActual.sku}</p>

          <div className="info-tabs">
            <div className="tab-headers">
              <button onClick={() => setActiveTab('descripcion')} className={activeTab === 'descripcion' ? 'active' : ''}>Descripción</button>
              <button onClick={() => setActiveTab('detalles')} className={activeTab === 'detalles' ? 'active' : ''}>Detalles</button>
              <button onClick={() => setActiveTab('envio')} className={activeTab === 'envio' ? 'active' : ''}>Envío</button>
            </div>
            <div className="tab-content">
              {activeTab === 'descripcion' && <p>{productoActual.descripcion || 'No hay descripción disponible.'}</p>}
              {activeTab === 'detalles' && <p>{productoActual.detalles || 'No hay detalles adicionales disponibles.'}</p>}
              {activeTab === 'envio' && <p>{productoActual.infoEnvio || 'Información de envío no disponible.'}</p>}
            </div>
          </div>
        </div>
      </div>

      {recomendaciones && recomendaciones.length > 0 && (
           <div className="recommendations-section">
               <h2>TAMBIÉN TE PODRÍA INTERESAR</h2>
               <RecomendacionesCarousel productos={recomendaciones} />
           </div>
      )}
    </div>
  );
};