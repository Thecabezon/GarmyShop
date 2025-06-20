// src/page/TiendaPage.js

import React, { useState, useEffect } from 'react';
import '../styles/Tienda.css';
import { ProductModal } from '../components/ProductModal';
import { RopaComponente } from '../components/RopaComponente';

// --- ELIMINAMOS ESTO ---
// Ya no usaremos la plantilla de datos estáticos.
// const detallesPlantilla = { ... };

export function TiendaPage({ handleAddToCart, favoriteItems, handleToggleFavorite }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // --- NUEVO: Estado para gestionar la carga dentro del modal ---
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8085/api/productos');
        if (!response.ok) {
          throw new Error('La respuesta de la red no fue correcta. Revisa si la API está encendida.');
        }
        const data = await response.json();
        setProductos(data.content); 
      } catch (error) {
        setError(error.message);
        console.error("Error al obtener los productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // --- ¡LÓGICA ACTUALIZADA! Esta función ahora se conecta a la API ---
  const handleOpenModal = async (productoDeLista) => {
    // 1. Mostramos un indicador de carga para el modal
    setModalLoading(true);
    setIsModalOpen(true);
    setSelectedProduct({ nombre: "Cargando..." }); // Mensaje temporal

    try {
      // 2. Hacemos la llamada a la API usando el ID del producto
      const response = await fetch(`http://localhost:8085/api/productos/${productoDeLista.id}`);
      if (!response.ok) {
        throw new Error('No se pudieron cargar los detalles del producto.');
      }
      const apiData = await response.json(); // Este es el JSON que me mostraste

      // 3. Adaptamos los datos de la API al formato que el modal necesita
      const imagenPrincipalPath = apiData.imagenes.find(img => img.esPrincipal)?.imagen || (apiData.imagenes[0]?.imagen);
      
      const productoCompleto = {
        id: apiData.id,
        nombre: apiData.nombre,
        precio: apiData.precio,
        imagen: imagenPrincipalPath, // La RUTA de la imagen principal (ej: "productos/img.png")
        imagenes: apiData.imagenes.map(img => img.imagen), // Array con las RUTAS de todas las imágenes
        
        // Extraemos tallas únicas de las combinaciones
        tallasDisponibles: [...new Set(apiData.combinacionesDisponibles.map(c => c.talla.nombre))]
          .map(nombreTalla => ({ talla: nombreTalla, disponible: true })),
        
        // Extraemos colores únicos de las combinaciones
        coloresDisponibles: apiData.combinacionesDisponibles
          .map(c => c.color)
          .filter((color, index, self) => 
            index === self.findIndex((c) => c.id === color.id)
          ),
      };

      // 4. Actualizamos el estado con el producto completo y desactivamos la carga
      setSelectedProduct(productoCompleto);
      setModalLoading(false);

    } catch (err) {
      console.error("Error al obtener detalles para el modal:", err);
      alert('Hubo un error al cargar el producto. Por favor, inténtalo de nuevo.');
      handleCloseModal(); // Cierra el modal si hay un error
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setModalLoading(false);
  };

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
        // Pasamos el estado de carga al modal
        isLoading={modalLoading} 
      />
    </div>
  );
}