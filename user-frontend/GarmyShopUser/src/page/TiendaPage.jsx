// src/page/TiendaPage.js

import React, { useState, useEffect } from 'react';
import '../styles/Tienda.css';
import { ProductModal } from '../components/ProductModal';
import { RopaComponente } from '../components/RopaComponente';

// Plantilla para detalles (se mantiene sin cambios)
const detallesPlantilla = {
  imagenesAdicionales: ["https://gw.alicdn.com/imgextra/i1/2450640915/TB2s5BWcgoQMeJjy1XaXXcSsFXa_!!2450640915.jpg_540x540.jpg", 
    "https://ae01.alicdn.com/kf/S11cf505076a548acb262c9db137fa818w.jpg_640x640q90.jpg", 
    "https://ae01.alicdn.com/kf/H2e6eb19804e543c698322c47e2c5533dR.jpg_960x960.jpg"],
  tallasDisponibles: [
    { talla: 'XS', disponible: true }, { talla: 'S', disponible: true }, { talla: 'M', disponible: true }, 
    { talla: 'L', disponible: false }, { talla: 'XL', disponible: true }
  ],
  coloresDisponibles: [
    { nombre: 'Negro', codigoHex: '#000000' }, { nombre: 'Blanco', codigoHex: '#ffffff' }, 
    { nombre: 'Gris', codigoHex: '#808080' }, { nombre: 'Azul', codigoHex: '#0000ff' }
  ],
  detalles: "Composición: 95% Algodón, 5% Elastano. Cuidado: Lavar a máquina con agua fría.",
  infoEnvio: "Envío estándar de 3 a 5 días hábiles. Devoluciones gratuitas."
};

export function TiendaPage({ handleAddToCart, favoriteItems, handleToggleFavorite }) {
  // --> Estados para guardar productos de la API, estado de carga y errores
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el modal (sin cambios)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --> useEffect para llamar a la API cuando el componente se carga
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8085/api/productos');
        if (!response.ok) {
          throw new Error('La respuesta de la red no fue correcta. Revisa si la API está encendida.');
        }
        const data = await response.json();
        // --> Tu API devuelve los productos dentro de la propiedad "content"
        setProductos(data.content); 
      } catch (error) {
        setError(error.message);
        console.error("Error al obtener los productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []); // El array vacío [] asegura que el efecto se ejecute solo una vez

  // Adaptamos los datos de la API a lo que el modal espera
  const handleOpenModal = (producto) => {
    const productoCompleto = {
      ...producto,
      imagen: producto.imagenPrincipalUrl, // Mapeamos el campo
      imagenes: [producto.imagenPrincipalUrl, ...detallesPlantilla.imagenesAdicionales],
      tallasDisponibles: detallesPlantilla.tallasDisponibles,
      coloresDisponibles: detallesPlantilla.coloresDisponibles,
      detalles: detallesPlantilla.detalles,
      infoEnvio: detallesPlantilla.infoEnvio,
    };
    setSelectedProduct(productoCompleto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // --> Manejo de estados de carga y error en la interfaz
  if (loading) {
    return <div className="productos-container"><h2 className="productos-titulo">Cargando productos...</h2></div>;
  }

  if (error) {
    return <div className="productos-container"><h2 className="productos-titulo" style={{color: 'red'}}>Error: {error}</h2></div>;
  }

  return (
    <div className="productos-container">
      <h2 className="productos-titulo">Nuestros Productos</h2>
      <div className="ropa-lista">
        {productos.map((producto) => {
          // --> Verificamos si es favorito usando el 'id' de la API
          const isLiked = favoriteItems.some(item => item.id === producto.id);

          return (
            <RopaComponente
              key={producto.id}
              producto={producto}
              isLiked={isLiked}
              handleOpenModal={handleOpenModal}
              handleToggleFavorite={handleToggleFavorite}
            />
          );
        })}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        producto={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}