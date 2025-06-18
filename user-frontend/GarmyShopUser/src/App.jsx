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

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

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

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas con MainLayout */}
        <Route path="/" element={<MainLayout cartItems={cartItems} setCartItems={setCartItems}><InicioPage /></MainLayout>} />
        <Route path="/tienda" element={<MainLayout cartItems={cartItems} setCartItems={setCartItems}><TiendaPage handleAddToCart={handleAddToCart} /></MainLayout>} />
        
        <Route 
            path="/categorias" 
            element={
                <MainLayout cartItems={cartItems} setCartItems={setCartItems}>
                    <CategoriasPage /> {/* CategoriasPage va como hijo del layout */}
                </MainLayout>
            } 
        />

        {/* RUTA DE MARCAS CORREGIDA */}
        <Route path="/marcas" element={<MainLayout cartItems={cartItems} setCartItems={setCartItems}><MarcasPage /></MainLayout>} />
        
        <Route 
          path="/tienda/:cod" 
          element={
            <MainLayout cartItems={cartItems} setCartItems={setCartItems}>
              <ProductoDetallePage handleAddToCart={handleAddToCart} />
            </MainLayout>
          } 
        />
        

        <Route path="/buscar" element={<MainLayout cartItems={cartItems} setCartItems={setCartItems}><BuscadorPage /></MainLayout>} />
        <Route 
          path="/finalizar_compra" 
          element={
            <MainLayout cartItems={cartItems} setCartItems={setCartItems}>
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