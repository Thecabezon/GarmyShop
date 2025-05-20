import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { InicioPage } from './page/InicioPage';
import { MainLayout } from './layout/MainLayout';
import { TiendaPage } from './page/TiendaPage';
import { RopaDetalle } from './components/RopaDetalle';
function App() {

  return (

    <BrowserRouter>
      <MainLayout />
      
      <Routes>
        <Route path="/" element={<InicioPage />} />
        <Route path='/tienda' element={<TiendaPage />} />
        <Route path='/tienda/:cod' element={<RopaDetalle />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
