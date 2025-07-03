import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import authService from './components/Auth/authService';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { InicioPage } from './page/InicioPage';
import MainLayout from './layout/MainLayout';
import { TiendaPage } from './page/TiendaPage';
import { ProductoDetallePage } from './page/ProductoDetallePage';
import FinalizarCompraPage from './page/FinalizarCompraPage';
import { FavoritosPage } from './page/FavoritosPage';
import MarcasPage from './page/MarcasPage';

import SobreNosotrosPage from './page/SobreNosotrosPage';
import MisPedidosPage from './page/MisPedidosPage';
import PedidoDetallePage from './page/PedidoDetallePage';
import { BusquedaPage } from './page/BusquedaPage';

import LoginPage from './page/Auth/LoginPage';
import RegisterPage from './page/Auth/RegisterPage';
import ForgotPasswordPage from './page/Auth/ForgotPasswordPage';
import PagoExitosoPage from './page/PagoExitosoPage';
import ResetPasswordForm from './components/Auth/ResetPasswordForm';
import OAuth2RedirectHandler from './components/Auth/OAuth2RedirectHandler';

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const loadUserData = async () => {
    setAuthLoading(true);
    const token = localStorage.getItem('token');
    const storedUser = authService.getCurrentUser();

    if (token) {
      setIsAuthenticated(true);
      if (storedUser && storedUser.id) {
        setCurrentUser(storedUser);
        const userCartKey = `cartItems_${storedUser.id}`;
        const userFavoritesKey = `favoriteItems_${storedUser.id}`;
        const storedCart = localStorage.getItem(userCartKey);
        const storedFavorites = localStorage.getItem(userFavoritesKey);
        setCartItems(storedCart ? JSON.parse(storedCart) : []);
        setFavoriteItems(storedFavorites ? JSON.parse(storedFavorites) : []);

        if (!storedUser.firstName || !storedUser.lastName) {
          try {
            const profile = await authService.fetchUserProfile();
            const completeUser = { ...storedUser, ...profile };
            localStorage.setItem('user', JSON.stringify(completeUser));
            setCurrentUser(completeUser);
          } catch (error) {
             toast.error("Error al cargar tu perfil.");
          }
        }
      } else {
        try {
          const profile = await authService.fetchUserProfile();
          const completeUser = {
            id: profile.id, username: profile.username, email: profile.email, firstName: profile.firstName, lastName: profile.lastName
          };
          localStorage.setItem('user', JSON.stringify(completeUser));
          setCurrentUser(completeUser);
          setIsAuthenticated(true);
          const userCartKey = `cartItems_${completeUser.id}`;
          const userFavoritesKey = `favoriteItems_${completeUser.id}`;
          const storedCart = localStorage.getItem(userCartKey);
          const storedFavorites = localStorage.getItem(userFavoritesKey);
          setCartItems(storedCart ? JSON.parse(storedCart) : []);
          setFavoriteItems(storedFavorites ? JSON.parse(storedFavorites) : []);
        } catch (error) {
          authService.clearAuthData();
          setCurrentUser(null);
          setIsAuthenticated(false);
          const storedCart = localStorage.getItem('cartItems');
          const storedFavorites = localStorage.getItem('favoriteItems');
          setCartItems(storedCart ? JSON.parse(storedCart) : []);
          setFavoriteItems(storedFavorites ? JSON.parse(storedFavorites) : []);
          toast.warning("Tu sesión ha expirado o es inválida. Por favor, inicia sesión de nuevo.");
        }
      }
    } else {
      setCurrentUser(null);
      setIsAuthenticated(false);
      const storedCart = localStorage.getItem('cartItems');
      const storedFavorites = localStorage.getItem('favoriteItems');
      setCartItems(storedCart ? JSON.parse(storedCart) : []);
      setFavoriteItems(storedFavorites ? JSON.parse(storedFavorites) : []);
    }
    setAuthLoading(false);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentUser && currentUser.id) {
      localStorage.setItem(`cartItems_${currentUser.id}`, JSON.stringify(cartItems));
    } else {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && currentUser && currentUser.id) {
      localStorage.setItem(`favoriteItems_${currentUser.id}`, JSON.stringify(favoriteItems));
    } else {
      localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
    }
  }, [favoriteItems, currentUser, isAuthenticated]);

  const handleAuthChange = () => {
    loadUserData();
  };

  const handleAddToCart = (producto) => {
    let itemAddedMessage = '';

    setCartItems((prevItems) => {
      const itemIdentifier = producto.idUnicoCarrito || producto.id;
      const existingItem = prevItems.find(item => (item.idUnicoCarrito || item.id) === itemIdentifier);

      if (existingItem) {
        itemAddedMessage = `Cantidad de ${producto.nombre} actualizada en el carrito.`;
        return prevItems.map(item =>
          (item.idUnicoCarrito || item.id) === itemIdentifier
            ? { ...item, quantity: (item.quantity || 0) + (producto.cantidad || 1) }
            : item
        );
      } else {
        const newItem = {
          ...producto,
          id: producto.id,
          nombre: producto.nombre,
          precio: parseFloat(producto.displayPrice || producto.price || producto.precio) || 0,
          imagen: producto.imagen,
          talla: producto.talla,
          color: producto.color,
          cantidad: producto.cantidad || 1,
          quantity: producto.cantidad || 1,
          idUnicoCarrito: itemIdentifier,
          combinacionProductoId: producto.combinacionProductoId
        };
        itemAddedMessage = `${producto.nombre} añadido al carrito.`;
        return [...prevItems, newItem];
      }
    });
    toast.success(itemAddedMessage);
  };

  const handleToggleFavorite = (producto) => {
    let notificationMessage = '';
    setFavoriteItems((prevFavorites) => {
      const isFavorite = prevFavorites.some(item => item.id === producto.id);
      if (isFavorite) {
        notificationMessage = `${producto.nombre} removido de favoritos.`;
        return prevFavorites.filter(item => item.id !== producto.id);
      } else {
        notificationMessage = `${producto.nombre} añadido a favoritos.`;
        return [...prevFavorites, producto];
      }
    });
    toast.info(notificationMessage);
  };

  return (
    <BrowserRouter>
       <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

      <Header
        cartItems={cartItems}
        setCartItems={setCartItems}
        favoriteItems={favoriteItems}
        setFavoriteItems={setFavoriteItems}
        handleToggleFavorite={handleToggleFavorite}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onAuthChange={handleAuthChange}
      />

      <Routes>
        <Route path="/" element={<MainLayout><InicioPage /></MainLayout>} />
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
        <Route
          path="/buscar"
          element={<BusquedaPage
            handleAddToCart={handleAddToCart}
            favoriteItems={favoriteItems}
            handleToggleFavorite={handleToggleFavorite}
          />}
        />
        <Route path="/nosotros" element={<MainLayout><SobreNosotrosPage /></MainLayout>} />
        <Route path="/marcas" element={<MainLayout><MarcasPage /></MainLayout>} />
        <Route
          path="/producto/:cod"
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
        <Route
          path="/finalizar_compra"
          element={
            <MainLayout>
              <FinalizarCompraPage cartItems={cartItems} setCartItems={setCartItems} />
            </MainLayout>
          }
        />
        <Route
          path="/pago-exitoso"
          element={
            <MainLayout>
              <PagoExitosoPage setCartItems={setCartItems} />
            </MainLayout>
          }
        />
        <Route
          path="/mis-pedidos"
          element={
            <MainLayout>
              <MisPedidosPage />
            </MainLayout>
          }
        />
        <Route
          path="/mis-pedidos/:ordenId"
          element={
            <MainLayout>
              <PedidoDetallePage />
            </MainLayout>
          }
        />
        <Route path="/login" element={<LoginPage onAuthChange={handleAuthChange} />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordForm />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler onAuthChange={handleAuthChange} />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;