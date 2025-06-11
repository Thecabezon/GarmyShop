import {BrowserRouter, Routes, Route} from 'react-router-dom';

// Importaciones corregidas según tu estructura actual
import { InicioPage } from './page/InicioPage';  // Cambiado de 'pages' a 'page'
import { MainLayout } from './layout/MainLayout';
import {TiendaPage} from './page/TiendaPage';    // Cambiado de 'pages' a 'page'
import { RopaDetalle } from './components/RopaDetalle';
import CategoriasPage from './page/CategoriasPage';  // Cambiado de 'pages' a 'page'
import { BuscadorPage } from './page/BuscadorPage';  // Cambiado de 'pages' a 'page'
import Footer from './components/Footer';

// Importaciones de autenticación - crear estas páginas en page/Auth/
import LoginPage from './page/Auth/LoginPage';
import RegisterPage from './page/Auth/RegisterPage';
import ForgotPasswordPage from './page/Auth/ForgotPasswordPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      {/* Rutas con MainLayout */}
      <Route path="/" element={<MainLayout><InicioPage /></MainLayout>} />
      <Route path='/tienda' element={<MainLayout><TiendaPage /></MainLayout>} />
      <Route path='/tienda/:cod' element={<MainLayout><RopaDetalle /></MainLayout>} />
      <Route path="/categoria" element={<MainLayout><CategoriasPage /></MainLayout>} />
      <Route path="/buscar" element={<MainLayout><BuscadorPage /></MainLayout>} />
      
      {/* Rutas de autenticación sin MainLayout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
    </Routes>
    <Footer />
    </BrowserRouter>
  )
}

export default App;