import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Importaciones de tus páginas y layouts
import { InicioPage } from './page/InicioPage';
import { MainLayout } from './layout/MainLayout';
import { TiendaPage } from './page/TiendaPage';
// import { RopaDetalle } from './components/RopaDetalle'; // <-- YA NO USAREMOS ESTA
import { ProductoDetallePage } from './page/ProductoDetallePage'; // <-- 1. IMPORTA EL NUEVO COMPONENTE
import CategoriasPage from './page/CategoriasPage';
import { BuscadorPage } from './page/BuscadorPage';
import FinalizarCompraPage from './page/FinalizarCompraPage';

// Importaciones de autenticación
import LoginPage from './page/Auth/LoginPage';
import RegisterPage from './page/Auth/RegisterPage';
import ForgotPasswordPage from './page/Auth/ForgotPasswordPage';
import Footer from './components/Footer';

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Esta función `handleAddToCart` es la que se usa en la TiendaPage
  const handleAddToCart = (producto) => {
    // NOTA: Tal vez necesites ajustar esta lógica en el futuro para manejar
    // los productos con talla y color que vienen de la página de detalle.
    // Por ahora, la lógica de la página de detalle se encarga de crear un ID único.
    
    setCartItems((prevItems) => {
      // El producto de la página de detalle puede tener un 'idUnicoCarrito'
      const itemIdentifier = producto.idUnicoCarrito || producto.cod;
      const existingItem = prevItems.find(item => (item.idUnicoCarrito || item.cod) === itemIdentifier);

      if (existingItem) {
        return prevItems.map(item =>
          (item.idUnicoCarrito || item.cod) === itemIdentifier
            ? { ...item, quantity: item.quantity + (producto.cantidad || 1) } // Suma la cantidad seleccionada
            : item
        );
      } else {
        // Asegura que la cantidad inicial sea la seleccionada o 1 por defecto
        return [...prevItems, { ...producto, quantity: producto.cantidad || 1 }];
      }
    });
  };


  return (
    <BrowserRouter>
      {/* El MainLayout ahora podría estar fuera de las Routes para no repetirlo, 
          pero tu estructura actual también es válida. La mantendré. */}
      <Routes>
        {/* Rutas con MainLayout */}
        <Route path="/" element={<MainLayout cartItems={cartItems} setCartItems={setCartItems}><InicioPage /></MainLayout>} />
        <Route path="/tienda" element={<MainLayout cartItems={cartItems} setCartItems={setCartItems}><TiendaPage handleAddToCart={handleAddToCart} /></MainLayout>} />
        
        {/* --- ESTA ES LA RUTA MODIFICADA --- */}
        <Route 
          path="/tienda/:cod" 
          element={
            <MainLayout cartItems={cartItems} setCartItems={setCartItems}>
              <ProductoDetallePage handleAddToCart={handleAddToCart} />
            </MainLayout>
          } 
        />
        {/* --- FIN DE LA RUTA MODIFICADA --- */}

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