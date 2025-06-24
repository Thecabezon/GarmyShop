
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Páginas y Layouts
import { InicioPage } from './page/InicioPage';
import MainLayout from './layout/MainLayout';
import { TiendaPage } from './page/TiendaPage';
import { ProductoDetallePage } from './page/ProductoDetallePage';
import FinalizarCompraPage from './page/FinalizarCompraPage';
import { FavoritosPage } from './page/FavoritosPage';
import MarcasPage from './page/MarcasPage';
import {OfertasPage} from './page/OfertasPage';
import SobreNosotrosPage from './page/SobreNosotrosPage';

// Autenticación
import LoginPage from './page/Auth/LoginPage';
import RegisterPage from './page/Auth/RegisterPage';
import ForgotPasswordPage from './page/Auth/ForgotPasswordPage';

// Componentes globales
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  // Estados globales para carrito y favoritos
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [favoriteItems, setFavoriteItems] = useState(() => {
    const storedFavorites = localStorage.getItem('favoriteItems');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  // Persistencia en localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  // Añadir al carrito

  const handleAddToCart = (producto) => {
    setCartItems((prevItems) => {
      // Asegurarse de que tenemos un identificador único para el producto
      const itemIdentifier = producto.idUnicoCarrito || producto.id;
      
      // Buscar si el producto ya existe en el carrito
      const existingItem = prevItems.find(item => 
        (item.idUnicoCarrito || item.id) === itemIdentifier
      );
  
      if (existingItem) {
        // Si el producto ya existe, actualizar la cantidad
        return prevItems.map(item =>
          (item.idUnicoCarrito || item.id) === itemIdentifier
            ? { 
                ...item, 
                quantity: (item.quantity || 0) + (producto.cantidad || 1) 
              }
            : item
        );
      } else {
        // Si el producto no existe, añadirlo al carrito
        // Asegurarse de que el producto tiene toda la información necesaria
        const newItem = {
          ...producto,
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.displayPrice || producto.price || producto.precio, // Usar el precio correcto
          imagen: producto.imagen, // Asegurarse de que esto contiene la URL completa
          talla: producto.talla,
          color: producto.color,
          cantidad: producto.cantidad || 1,
          quantity: producto.cantidad || 1, // Mantener ambos para compatibilidad
          idUnicoCarrito: itemIdentifier
        };
        
        return [...prevItems, newItem];
      }
    });
    
    // Opcional: Mostrar confirmación
    console.log("Producto añadido al carrito:", producto);
  };

  // Añadir o quitar de favoritos
  const handleToggleFavorite = (producto) => {
    setFavoriteItems((prevFavorites) => {
      const isFavorite = prevFavorites.some(item => item.id === producto.id);
      if (isFavorite) {
        return prevFavorites.filter(item => item.id !== producto.id);
      } else {
        return [...prevFavorites, producto];
      }
    });
  };

  return (
    <BrowserRouter>
      <Header
        cartItems={cartItems}
        setCartItems={setCartItems}
        favoriteItems={favoriteItems}
        setFavoriteItems={setFavoriteItems}
        handleToggleFavorite={handleToggleFavorite}
      />

      <Routes>
        {/* Inicio */}
        <Route path="/" element={<MainLayout><InicioPage /></MainLayout>} />

        {/* Tienda */}
        <Route
          path="/tienda"
          element={
            <MainLayout>
              <TiendaPage
                handleAddToCart={handleAddToCart}
                handleToggleFavorite={handleToggleFavorite}
                favoriteItems={favoriteItems}
              />
            </MainLayout>
          }
        />
        <Route path="/ofertas" element={<OfertasPage handleAddToCart={handleAddToCart} />} />
        <Route path="/nosotros" element={<SobreNosotrosPage />} />

        {/* Detalle de producto - CORREGIDO */}
        <Route
          path="/producto/:cod"  // Cambiado de "/tienda/:cod" a "/producto/:cod"
          element={
            <MainLayout>
              <ProductoDetallePage
                handleAddToCart={handleAddToCart}
                handleToggleFavorite={handleToggleFavorite}
                favoriteItems={favoriteItems}
              />
            </MainLayout>
          }
        />

        {/* Favoritos */}
        <Route
          path="/favoritos"
          element={
            <MainLayout>
              <FavoritosPage
                favoriteItems={favoriteItems}
                handleToggleFavorite={handleToggleFavorite}
              />
            </MainLayout>
          }
        />

        {/* Marcas */}
        <Route path="/marcas" element={<MainLayout><MarcasPage /></MainLayout>} />

        {/* Finalizar compra */}
        <Route
          path="/finalizar_compra"
          element={
            <MainLayout>
              <FinalizarCompraPage cartItems={cartItems} setCartItems={setCartItems} />
            </MainLayout>
          }
        />

        {/* Rutas de autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/recuperar-password" element={<ForgotPasswordPage />} />

        {/* Ruta 404 (opcional) */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;