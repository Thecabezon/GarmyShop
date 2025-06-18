import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Importaciones de tus páginas y layouts
import { InicioPage } from './page/InicioPage';
import { MainLayout } from './layout/MainLayout';
import { TiendaPage } from './page/TiendaPage';
import { ProductoDetallePage } from './page/ProductoDetallePage';
import CategoriasPage from './page/CategoriasPage';
import { BuscadorPage } from './page/BuscadorPage';
import FinalizarCompraPage from './page/FinalizarCompraPage';
// --> 1. IMPORTAR LA NUEVA PÁGINA DE FAVORITOS
import { FavoritosPage } from './page/FavoritosPage';

// Importaciones de autenticación
import LoginPage from './page/Auth/LoginPage';
import RegisterPage from './page/Auth/RegisterPage';
import ForgotPasswordPage from './page/Auth/ForgotPasswordPage';
import Footer from './components/Footer';

import MarcasPage from './page/MarcasPage';

function App() {
  // Estado para el carrito (SIN CAMBIOS)
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // --> 2. AÑADIR ESTADO GLOBAL PARA FAVORITOS (igual que el carrito)
  const [favoriteItems, setFavoriteItems] = useState(() => {
    const storedFavorites = localStorage.getItem('favoriteItems');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  // useEffect para el carrito (SIN CAMBIOS)
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // --> 3. AÑADIR USEEFFECT PARA GUARDAR FAVORITOS EN LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  // Función para añadir al carrito (SIN CAMBIOS)
  const handleAddToCart = (producto) => {
    setCartItems((prevItems) => {
      const itemIdentifier = producto.idUnicoCarrito || producto.cod;
      const existingItem = prevItems.find(item => (item.idUnicoCarrito || item.cod) === itemIdentifier);

      if (existingItem) {
        return prevItems.map(item =>
          (item.idUnicoCarrito || item.cod) === itemIdentifier
            ? { ...item, quantity: item.quantity + (producto.cantidad || 1) }
            : item
        );
      } else {
        return [...prevItems, { ...producto, quantity: producto.cantidad || 1 }];
      }
    });
  };

  // --> 4. AÑADIR FUNCIÓN GLOBAL PARA MANEJAR FAVORITOS
  const handleToggleFavorite = (producto) => {
    setFavoriteItems((prevFavorites) => {
      const isFavorite = prevFavorites.some(item => item.cod === producto.cod);
      if (isFavorite) {
        return prevFavorites.filter(item => item.cod !== producto.cod);
      } else {
        return [...prevFavorites, producto];
      }
    });
  };

  return (
    <BrowserRouter>
      {/* --> 5. PASAR LOS NUEVOS ESTADOS Y FUNCIONES A LAS RUTAS QUE LO NECESITEN */}
      <Routes>
        <Route path="/" element={<MainLayout cartItems={cartItems} favoriteItems={favoriteItems}><InicioPage /></MainLayout>} />
        
        <Route 
          path="/tienda" 
          element={
            <MainLayout cartItems={cartItems} favoriteItems={favoriteItems}>
              <TiendaPage 
                handleAddToCart={handleAddToCart} 
                handleToggleFavorite={handleToggleFavorite} 
                favoriteItems={favoriteItems} 
              />
            </MainLayout>
          } 
        />
        
        <Route path="/marcas" element={<MainLayout cartItems={cartItems} favoriteItems={favoriteItems}><MarcasPage /></MainLayout>} />
        
        <Route 
          path="/tienda/:cod" 
          element={
            <MainLayout cartItems={cartItems} favoriteItems={favoriteItems}>
              <ProductoDetallePage 
                handleAddToCart={handleAddToCart} 
                handleToggleFavorite={handleToggleFavorite}
                favoriteItems={favoriteItems}
              />
            </MainLayout>
          } 
        />
        
        {/* --> 6. AÑADIR LA NUEVA RUTA PARA LA PÁGINA DE FAVORITOS */}
        <Route 
          path="/favoritos" 
          element={
            <MainLayout cartItems={cartItems} favoriteItems={favoriteItems}>
              <FavoritosPage 
                favoriteItems={favoriteItems} 
                handleToggleFavorite={handleToggleFavorite} 
              />
            </MainLayout>
          } 
        />
        
        <Route path="/categoria" element={<MainLayout cartItems={cartItems} favoriteItems={favoriteItems}><CategoriasPage /></MainLayout>} />
        <Route path="/buscar" element={<MainLayout cartItems={cartItems} favoriteItems={favoriteItems}><BuscadorPage /></MainLayout>} />
        <Route 
          path="/finalizar_compra" 
          element={
            <MainLayout cartItems={cartItems} favoriteItems={favoriteItems}>
              <FinalizarCompraPage cartItems={cartItems} setCartItems={setCartItems} />
            </MainLayout>
          } 
        />

        {/* Rutas de autenticación sin MainLayout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;