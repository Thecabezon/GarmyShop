import React from 'react';
import NavLinksComponent from '../components/Header/NavLinksComponent';
import { LogoComponent } from '../components/Header/LogoComponent';
import { TopBarComponent } from '../components/Header/TopBarComponent';
import IconsComponent from '../components/Header/IconsComponent';
import '../styles/header.css';

// --> AHORA RECIBE 'favoriteItems' y lo pasa a IconsComponent
// He quitado setCartItems porque no se usa aquí, se pasa directo a las páginas.
export const MainLayout = ({ children, cartItems, favoriteItems }) => {
  return (
    <>
      <header className="site-header">
        <TopBarComponent />
        <div className="main-header">
          <LogoComponent />
          <NavLinksComponent />
          <IconsComponent cartItems={cartItems} favoriteItems={favoriteItems} />
        </div>
      </header>
      <main className="content-area">{children}</main>
    </>
  );
};