import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import authService from './components/Auth/authService';

// Páginas y Layouts
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
// Autenticación
import LoginPage from './page/Auth/LoginPage';
import RegisterPage from './page/Auth/RegisterPage';
import ForgotPasswordPage from './page/Auth/ForgotPasswordPage';
import PagoExitosoPage from './page/PagoExitosoPage';
import ResetPasswordForm from './components/Auth/ResetPasswordForm';

import OAuth2RedirectHandler from './components/Auth/OAuth2RedirectHandler';
import { DataProvider } from './context/DataContext';

import ContactoPage from './page/ContactoPage';

// Componentes globales
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  // Estados globales para carrito y favoritos
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);

  // ESTADOS: Para manejo de autenticación
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Función para cargar datos del usuario actual
  const loadUserData = async () => {
    setAuthLoading(true);

    const token = localStorage.getItem('token');
    const storedUser = authService.getCurrentUser();

    console.log("App loadUserData: token?", !!token, "storedUser?", !!storedUser);

    if (token) {
      setIsAuthenticated(true);

      if (storedUser && storedUser.id) {
        setCurrentUser(storedUser);
        console.log("App loadUserData: Token y usuario local encontrados.");

        // Cargar carrito y favoritos específicos del usuario
        const userCartKey = `cartItems_${storedUser.id}`;
        const userFavoritesKey = `favoriteItems_${storedUser.id}`;

        const storedCart = localStorage.getItem(userCartKey);
        const storedFavorites = localStorage.getItem(userFavoritesKey);

        setCartItems(storedCart ? JSON.parse(storedCart) : []);
        setFavoriteItems(storedFavorites ? JSON.parse(storedFavorites) : []);
        console.log(`App loadUserData: Items específicos cargados para user ${storedUser.id}.`);

        // Si el objeto de usuario está incompleto (ej: falta firstName), intentar obtener el perfil completo
        if (!storedUser.firstName || !storedUser.lastName) {
          console.log("App loadUserData: Usuario local incompleto, intentando obtener perfil completo...");
          try {
            const profile = await authService.fetchUserProfile(); // Asumiendo que usa el token
            const completeUser = { ...storedUser, ...profile };
            localStorage.setItem('user', JSON.stringify(completeUser));
            setCurrentUser(completeUser);
            console.log("App loadUserData: Perfil completo obtenido y actualizado.");
          } catch (error) {
            console.warn('App loadUserData: No se pudo obtener el perfil completo (token quizás inválido o error del backend):', error);
          }
        } else {
          console.log("App loadUserData: Usuario local ya completo.");
        }

      } else {
        console.warn("App loadUserData: Token encontrado, pero sin datos de usuario válidos. Intentando obtener perfil desde el backend.");
        try {
          const profile = await authService.fetchUserProfile();
          const completeUser = {
            id: profile.id,
            username: profile.username,
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName
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
          console.log(`App loadUserData: Items específicos cargados tras obtener perfil para user ${completeUser.id}.`);

        } catch (error) {
          console.error('App loadUserData: Falló obtener perfil con token. Limpiando datos de auth.', error);
          authService.clearAuthData();
          setCurrentUser(null);
          setIsAuthenticated(false);
          const storedCart = localStorage.getItem('cartItems');
          const storedFavorites = localStorage.getItem('favoriteItems');
          setCartItems(storedCart ? JSON.parse(storedCart) : []);
          setFavoriteItems(storedFavorites ? JSON.parse(storedFavorites) : []);
          console.log("App loadUserData: Items de invitado cargados.");
        }
      }
    } else {
      console.log("App loadUserData: No se encontró token. Usuario no autenticado.");
      setCurrentUser(null);
      setIsAuthenticated(false);
      const storedCart = localStorage.getItem('cartItems');
      const storedFavorites = localStorage.getItem('favoriteItems');
      setCartItems(storedCart ? JSON.parse(storedCart) : []);
      setFavoriteItems(storedFavorites ? JSON.parse(storedFavorites) : []);
      console.log("App loadUserData: Items de invitado cargados.");
    }

    setAuthLoading(false);
  };

  useEffect(() => {
    console.log("App useEffect: Montando, llamando a loadUserData...");
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
    console.log("App handleAuthChange: Se detectó un cambio de autenticación, recargando datos de usuario...");
    loadUserData();
  };

  const handleAddToCart = (producto) => {
    setCartItems((prevItems) => {
      const itemIdentifier = producto.idUnicoCarrito || producto.id;

      const existingItem = prevItems.find(item =>
        (item.idUnicoCarrito || item.id) === itemIdentifier
      );

      if (existingItem) {
        return prevItems.map(item =>
          (item.idUnicoCarrito || item.id) === itemIdentifier
            ? {
              ...item,
              quantity: (item.quantity || 0) + (producto.cantidad || 1)
            }


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
          idUnicoCarrito: itemIdentifier
        };

        return [...prevItems, newItem];
      }
    });

    console.log("App handleAddToCart: Producto añadido al carrito:", producto);
  };

  const handleToggleFavorite = (producto) => {
    setFavoriteItems((prevFavorites) => {
      const isFavorite = prevFavorites.some(item => item.id === producto.id);
      if (isFavorite) {
        console.log("App handleToggleFavorite: Removido de favoritos:", producto);
        return prevFavorites.filter(item => item.id !== producto.id);
      } else {
        console.log("App handleToggleFavorite: Añadido a favoritos:", producto);
        return [...prevFavorites, producto];
      }
    });
  };

  return (
    <DataProvider>
      <BrowserRouter>
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
          {/* Inicio */}
          <Route
            path="/"
            element={
              <MainLayout>
                <InicioPage
                  handleAddToCart={handleAddToCart}
                  handleToggleFavorite={handleToggleFavorite}
                  favoriteItems={favoriteItems}
                />
              </MainLayout>
            }
          />

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
          <Route
            path="/buscar"
            element={<BusquedaPage
              handleAddToCart={handleAddToCart}
              favoriteItems={favoriteItems}
              handleToggleFavorite={handleToggleFavorite}
            />}
          />
          {/* Ofertas, Nosotros, Marcas */}
          <Route path="/nosotros" element={<MainLayout><SobreNosotrosPage /></MainLayout>} />
          <Route path="/contacto" element={<MainLayout><ContactoPage /></MainLayout>} />
          <Route path="/marcas" element={<MainLayout><MarcasPage /></MainLayout>} />


          {/* Detalle de producto */}
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

          {/* Finalizar compra */}
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

          {/* --- AÑADE ESTA NUEVA RUTA --- */}
          <Route
            path="/mis-pedidos/:ordenId"
            element={
              <MainLayout>
                <PedidoDetallePage />
              </MainLayout>
            }
          />

          {/* Rutas de autenticación - Pasan onAuthChange */}
          <Route path="/login" element={<LoginPage onAuthChange={handleAuthChange} />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordForm />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler onAuthChange={handleAuthChange} />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;