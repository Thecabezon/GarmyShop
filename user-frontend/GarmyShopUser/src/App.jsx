import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Importaciones corregidas según tu estructura actual
import { InicioPage } from './page/InicioPage';
import { MainLayout } from './layout/MainLayout';
import { TiendaPage } from './page/TiendaPage';
import { RopaDetalle } from './components/RopaDetalle';
import CategoriasPage from './page/CategoriasPage';
import { BuscadorPage } from './page/BuscadorPage';
import FinalizarCompraPage from './page/FinalizarCompraPage';

// Importaciones de autenticación
import LoginPage from './page/Auth/LoginPage';
import RegisterPage from './page/Auth/RegisterPage';
import ForgotPasswordPage from './page/Auth/ForgotPasswordPage';
import Footer from './components/Footer'; // Asegúrate de que Footer esté importado



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
      const existingItem = prevItems.find(item => item.cod === producto.cod);
      if (existingItem) {
        return prevItems.map(item =>
          item.cod === producto.cod
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...producto, quantity: 1 }];
      }
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas con MainLayout */}
        <Route path="/" element={<MainLayout cartItems={cartItems} setCartItems={setCartItems}><InicioPage /></MainLayout>} />
        <Route path="/tienda" element={<MainLayout cartItems={cartItems} setCartItems={setCartItems}><TiendaPage handleAddToCart={handleAddToCart} /></MainLayout>} />
        <Route path="/tienda/:cod" element={<MainLayout cartItems={cartItems} setCartItems={setCartItems}><RopaDetalle /></MainLayout>} />
        <Route path="/categoria" element={<MainLayout cartItems={cartItems} setCartItems={setCartItems}><CategoriasPage /></MainLayout>} />
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
