import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Páginas y Layouts
import { InicioPage } from './page/InicioPage';
import MainLayout from './layout/MainLayout'; // Importación por defecto
import { TiendaPage } from './page/TiendaPage';
import { ProductoDetallePage } from './page/ProductoDetallePage';

import FinalizarCompraPage from './page/FinalizarCompraPage';
// CategoriasPage ya no se importa si no tiene ruta dedicada
// import CategoriasPage from './page/CategoriasPage';
import { FavoritosPage } from './page/FavoritosPage';

// Autenticación
import LoginPage from './page/Auth/LoginPage';
import RegisterPage from './page/Auth/RegisterPage';
import ForgotPasswordPage from './page/Auth/ForgotPasswordPage';

// Componentes globales (Header y Footer)
import Header from './components/Header'; // <-- Descomentado y ruta correcta
import Footer from './components/Footer';

import MarcasPage from './page/MarcasPage';


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

  // Efectos para persistir en localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  // Handlers para carrito y favoritos
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
      {/* Header global (renderizado en todas partes) */}
      {/* Descomentado y pasando las props necesarias */}
      <Header
        cartItems={cartItems} setCartItems={setCartItems}
        favoriteItems={favoriteItems} setFavoriteItems={setFavoriteItems}
        handleToggleFavorite={handleToggleFavorite}
      />

      <Routes>
        {/* Ruta de Inicio corregida a /home */}
        <Route path="/" element={<MainLayout><InicioPage /></MainLayout>}/>
        {/* Si quieres que '/' también funcione como inicio, duplica la ruta o usa un Redirect */}
        {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
        {/* O simplemente cambia la ruta de inicio de vuelta a '/' y asegúrate de que tus Links apunten a '/' */}


        <Route path="/tienda" element={<MainLayout><TiendaPage handleAddToCart={handleAddToCart} handleToggleFavorite={handleToggleFavorite} favoriteItems={favoriteItems}/></MainLayout>}/>
        <Route path="/tienda/:cod" element={<MainLayout><ProductoDetallePage handleAddToCart={handleAddToCart} handleToggleFavorite={handleToggleFavorite} favoriteItems={favoriteItems}/></MainLayout>}/>
        <Route path="/favoritos" element={<MainLayout><FavoritosPage favoriteItems={favoriteItems} handleToggleFavorite={handleToggleFavorite}/></MainLayout>}/>

        {/* Si la página de categorías *todavía* debe existir, descomenta la siguiente línea: */}
        {/* <Route path="/categorias" element={<MainLayout><CategoriasPage /></MainLayout>}/> */}

        <Route path="/marcas" element={<MainLayout><MarcasPage /></MainLayout>}/>
        
        <Route path="/finalizar_compra" element={<MainLayout><FinalizarCompraPage cartItems={cartItems} setCartItems={setCartItems}/></MainLayout>}/>

        {/* Rutas sin MainLayout (ej: autenticación) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/recuperar-password" element={<ForgotPasswordPage />} />

        {/* Ruta 404 opcional */}
        {/* <Route path="*" element={...} /> */}

      </Routes>

      {/* Footer global (renderizado en todas partes) */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;