import React from 'react'; // Importa React
import NavLinksComponent from '../components/Header/NavLinksComponent';
import { LogoComponent } from '../components/Header/LogoComponent';
import { TopBarComponent } from '../components/Header/TopBarComponent';
import IconsComponent from '../components/Header/IconsComponent';
import '../styles/header.css';

// MainLayout ahora acepta 'children' como una prop
export const MainLayout = ({ children }) => {
  return (
    <> {/* Usamos un Fragmento para agrupar el header y el contenido principal */}
      <header>
        <TopBarComponent />
        <div className="main-header">
          <LogoComponent />
          <NavLinksComponent />
          <IconsComponent />
        </div>
      </header>
      {/* Aquí se renderizará el contenido de la ruta activa (InicioPage, TiendaPage, BuscadorPage, etc.) */}
      <main className="content-area"> {/* Puedes agregar una clase para estilos si necesitas */}
        {children}
      </main>
      {/* Puedes añadir un Footer aquí si lo tienes */}
      {/* <FooterComponent /> */}
    </>
  );
};
