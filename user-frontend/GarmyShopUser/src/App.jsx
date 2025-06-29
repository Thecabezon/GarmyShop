import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import authService from './components/Auth/authService'; // Asegúrate de que la ruta sea correcta

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
import ResetPasswordForm from './components/Auth/ResetPasswordForm'; // Asegúrate de que la ruta sea correcta

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
  const [authLoading, setAuthLoading] = useState(true); // Nuevo estado para indicar si la carga de auth está en curso

  // Función para cargar datos del usuario actual
  const loadUserData = async () => {
      setAuthLoading(true); // Iniciar carga

      const token = localStorage.getItem('token');
      const storedUser = authService.getCurrentUser(); // Obtiene user de localStorage (no verifica token aquí)

      console.log("App loadUserData: token?", !!token, "storedUser?", !!storedUser);

      if (token) {
          // Si hay token, asumimos que hay un intento de sesión autenticada
          setIsAuthenticated(true);

          if (storedUser && storedUser.id) { // Verificar si storedUser existe y tiene ID
              // Tenemos token y datos básicos del usuario
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
              if (!storedUser.firstName || !storedUser.lastName) { // Añadida verificación de lastName también
                  console.log("App loadUserData: Usuario local incompleto, intentando obtener perfil completo...");
                  try {
                      const profile = await authService.fetchUserProfile(); // Asumiendo que usa el token
                      // Combinar datos existentes con datos del perfil
                      const completeUser = { ...storedUser, ...profile };
                      localStorage.setItem('user', JSON.stringify(completeUser));
                      setCurrentUser(completeUser); // Actualizar estado con info completa
                      console.log("App loadUserData: Perfil completo obtenido y actualizado.");
                  } catch (error) {
                      console.warn('App loadUserData: No se pudo obtener el perfil completo (token quizás inválido o error del backend):', error);
                       // Opcional: si el error es 401 (no autorizado), podrías llamar a handleLogout aquí.
                       // Para simplificar, por ahora mantenemos la sesión con la info básica si la hay.
                  }
              } else {
                 console.log("App loadUserData: Usuario local ya completo.");
              }

          } else {
              // Tenemos token, pero NO datos de usuario válidos en localStorage. Estado inconsistente.
              console.warn("App loadUserData: Token encontrado, pero sin datos de usuario válidos. Intentando obtener perfil desde el backend.");
              try {
                  const profile = await authService.fetchUserProfile();
                  // Si se pudo obtener el perfil, guardar en localStorage y actualizar estado
                  const completeUser = {
                      id: profile.id, // Asegúrate de que el endpoint /perfil devuelva el ID
                      username: profile.username,
                      email: profile.email,
                      firstName: profile.firstName,
                      lastName: profile.lastName
                  };
                  localStorage.setItem('user', JSON.stringify(completeUser));
                  setCurrentUser(completeUser);
                  setIsAuthenticated(true); // Confirmar autenticación

                  // Cargar carrito y favoritos específicos del usuario recién identificado
                   const userCartKey = `cartItems_${completeUser.id}`;
                   const userFavoritesKey = `favoriteItems_${completeUser.id}`;
                   const storedCart = localStorage.getItem(userCartKey);
                   const storedFavorites = localStorage.getItem(userFavoritesKey);
                   setCartItems(storedCart ? JSON.parse(storedCart) : []);
                   setFavoriteItems(storedFavorites ? JSON.parse(storedFavorites) : []);
                   console.log(`App loadUserData: Items específicos cargados tras obtener perfil para user ${completeUser.id}.`);

              } catch (error) {
                  // Si falla obtener el perfil con el token, el token es probablemente inválido. Limpiar todo.
                  console.error('App loadUserData: Falló obtener perfil con token. Limpiando datos de auth.', error);
                  authService.clearAuthData();
                  setCurrentUser(null);
                  setIsAuthenticated(false);
                  // Cargar carrito y favoritos de invitado
                  const storedCart = localStorage.getItem('cartItems');
                  const storedFavorites = localStorage.getItem('favoriteItems');
                  setCartItems(storedCart ? JSON.parse(storedCart) : []);
                  setFavoriteItems(storedFavorites ? JSON.parse(storedFavorites) : []);
                  console.log("App loadUserData: Items de invitado cargados.");
                   // Opcional: redirigir al login si el error es 401
                   // if (error && error.status === 401) navigate('/login'); // Necesitarías navigate aquí
              }
          }
      } else {
          // No hay token, el usuario no está autenticado.
          console.log("App loadUserData: No se encontró token. Usuario no autenticado.");
          setCurrentUser(null);
          setIsAuthenticated(false);
          // Cargar carrito y favoritos de invitado
          const storedCart = localStorage.getItem('cartItems');
          const storedFavorites = localStorage.getItem('favoriteItems');
          setCartItems(storedCart ? JSON.parse(storedCart) : []);
          setFavoriteItems(storedFavorites ? JSON.parse(storedFavorites) : []);
          console.log("App loadUserData: Items de invitado cargados.");
      }

      setAuthLoading(false); // Finalizar carga
  };

  // Cargar datos del usuario al iniciar la aplicación
  // Se ejecuta solo una vez al montar
  useEffect(() => {
    console.log("App useEffect: Montando, llamando a loadUserData...");
    loadUserData();
  }, []); // El array vacío asegura que solo se ejecuta al montar

  // Persistencia en localStorage específica por usuario
  // Estos efectos guardan el carrito y los favoritos cada vez que cambian
  // y que la autenticación/usuario actual están definidos.
  useEffect(() => {
      // console.log("App useEffect [cartItems]: Guardando carrito...");
      if (isAuthenticated && currentUser && currentUser.id) {
          localStorage.setItem(`cartItems_${currentUser.id}`, JSON.stringify(cartItems));
           // console.log(`App useEffect [cartItems]: Guardado en ${`cartItems_${currentUser.id}`}`);
      } else {
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
           // console.log(`App useEffect [cartItems]: Guardado en 'cartItems' (invitado).`);
      }
  }, [cartItems, currentUser, isAuthenticated]); // Depende de cartItems, currentUser, isAuthenticated

  useEffect(() => {
       // console.log("App useEffect [favoriteItems]: Guardando favoritos...");
      if (isAuthenticated && currentUser && currentUser.id) {
          localStorage.setItem(`favoriteItems_${currentUser.id}`, JSON.stringify(favoriteItems));
          // console.log(`App useEffect [favoriteItems]: Guardado en ${`favoriteItems_${currentUser.id}`}`);
      } else {
          localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
          // console.log(`App useEffect [favoriteItems]: Guardado en 'favoriteItems' (invitado).`);
      }
  }, [favoriteItems, currentUser, isAuthenticated]); // Depende de favoriteItems, currentUser, isAuthenticated


  // Función para manejar cambios de autenticación (llamada por LoginPage, Logout, etc.)
  // Simplemente recarga los datos para sincronizar el estado global.
  const handleAuthChange = () => {
    console.log("App handleAuthChange: Se detectó un cambio de autenticación, recargando datos de usuario...");
    loadUserData();
  };

  // Añadir al carrito (sin cambios aparentes necesarios)
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
          // Usar displayPrice si existe, si no price, si no precio. Convertir a número.
          precio: parseFloat(producto.displayPrice || producto.price || producto.precio) || 0,
          imagen: producto.imagen,
          talla: producto.talla,
          color: producto.color, // Asumiendo que color es un objeto { id, nombre, ... }
          cantidad: producto.cantidad || 1,
          quantity: producto.cantidad || 1,
          idUnicoCarrito: itemIdentifier // Mantener el ID único para el carrito
        };

        return [...prevItems, newItem];
      }
    });

    console.log("App handleAddToCart: Producto añadido al carrito:", producto);
  };

  // Añadir o quitar de favoritos (sin cambios aparentes necesarios)
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

  // Puedes mostrar un spinner o algo mientras authLoading es true
  // if (authLoading) {
  //    return <div>Cargando sesión...</div>;
  // }

  return (
    <BrowserRouter>
      <Header
        cartItems={cartItems}
        setCartItems={setCartItems}
        favoriteItems={favoriteItems}
        setFavoriteItems={setFavoriteItems} // Aunque no se usa en Header, es buena práctica pasarlo si se maneja ahí
        handleToggleFavorite={handleToggleFavorite} // Aunque no se usa en Header, es buena práctica pasarlo
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onAuthChange={handleAuthChange}
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
        {/* Ofertas, Nosotros, Marcas */}
        <Route path="/ofertas" element={<MainLayout><OfertasPage handleAddToCart={handleAddToCart} /></MainLayout>} />
        <Route path="/nosotros" element={<MainLayout><SobreNosotrosPage /></MainLayout>} />
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
                handleToggleFavorite={handleToggleFavorite} // Necesario para quitar de favoritos en la página de favoritos
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

        {/* Rutas de autenticación - Pasan onAuthChange */}
        <Route path="/login" element={<LoginPage onAuthChange={handleAuthChange} />} />
        <Route path="/registro" element={<RegisterPage />} /> {/* Generalmente el registro no cambia el estado de auth inmediatamente sin login */}
        <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordForm />} />
        {/* TODO: Añadir rutas protegidas para /perfil, /mis-pedidos, /direcciones */}
        {/* Puedes usar un componente Wrapper para proteger estas rutas basado en isAuthenticated */}
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;