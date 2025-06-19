import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Importaciones de tus páginas y layouts
import { InicioPage } from './page/InicioPage';
import { MainLayout } from './layout/MainLayout';
import { TiendaPage } from './page/TiendaPage';
import { ProductoDetallePage } from './page/ProductoDetallePage';
import { BuscadorPage } from './page/BuscadorPage';
import FinalizarCompraPage from './page/FinalizarCompraPage';
import CategoriasPage from './page/CategoriasPage';
import { FavoritosPage } from './page/FavoritosPage';

// Importaciones de autenticación
import LoginPage from './page/Auth/LoginPage';
import RegisterPage from './page/Auth/RegisterPage';
import ForgotPasswordPage from './page/Auth/ForgotPasswordPage';
import Footer from './components/Footer';
import MarcasPage from './page/MarcasPage';

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [favoriteItems, setFavoriteItems] = useState(() => {
    const storedFavorites = localStorage.getItem('favoriteItems');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
  }, [favoriteItems]);

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
      <Routes>
        <Route path="/" element={
          <MainLayout cartItems={cartItems} favoriteItems={favoriteItems}>
            <InicioPage />
          </MainLayout>
        }/>

        <Route path="/tienda" element={
          <MainLayout cartItems={cartItems} favoriteItems={favoriteItems}>
            <TiendaPage 
              handleAddToCart={handleAddToCart} 
              handleToggleFavorite={handleToggleFavorite} 
              favoriteItems={favoriteItems} 
            />
          </MainLayout>
        }/>

        <Route path="/tienda/:cod" element={
          <MainLayout cartItems={cartItems} favoriteItems={favoriteItems}>
            <ProductoDetallePage 
              handleAddToCart={handleAddToCart} 
              handleToggleFavorite={handleToggleFavorite}
              favoriteItems={favoriteItems}
            />
          </MainLayout>
        }/>

        <Route path="/favoritos" element={
          <MainLayout cartItems={cartItems} favoriteItems={favoriteItems}>
            <FavoritosPage 
              favoriteItems={favoriteItems} 
              handleToggleFavorite={handleToggleFavorite} 
            />
          </MainLayout>
        }/>

        <Route path="/categorias" element={
          <MainLayout cartItems={cartItems} favoriteItems={favoriteItems}>
            <CategoriasPage />
          </MainLayout>
        }/>

        <Route path="/marcas" element={
          <MainLayout cartItems={cartItems} favoriteItems={favoriteItems}>
            <MarcasPage />
          </MainLayout>
        }/>

        <Route path="/buscar" element={
          <MainLayout cartItems={cartItems} favoriteItems={favoriteItems}>
            <BuscadorPage />
          </MainLayout>
        }/>

        <Route path="/finalizar_compra" element={
          <MainLayout cartItems={cartItems} favoriteItems={favoriteItems}>
            <FinalizarCompraPage cartItems={cartItems} setCartItems={setCartItems} />
          </MainLayout>
        }/>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
