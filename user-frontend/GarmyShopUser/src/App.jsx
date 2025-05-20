import {BrowserRouter, Routes, Route} from 'react-router-dom';

import { InicioPage } from './page/InicioPage';
import { MainLayout } from './layout/MainLayout';
import {TiendaPage} from './page/TiendaPage';
import { RopaDetalle } from './components/RopaDetalle';
import CategoriasPage from './page/CategoriasPage';
import { BuscadorPage } from './page/BuscadorPage'; // Asegúrate de que la ruta sea correcta

function App() {
  return (
    <BrowserRouter>
      {/* MainLayout ahora envuelve a las Routes para que el layout se aplique a todas las páginas */}
      <MainLayout>
        <Routes>
          <Route path="/" element={<InicioPage />} />
          <Route path='/tienda' element={<TiendaPage />} />
          <Route path='/tienda/:cod' element={<RopaDetalle />} />
          <Route path="/categoria" element={<CategoriasPage />} />
          {/* Nueva ruta para el Buscador */}
          <Route path="/buscar" element={<BuscadorPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App;
