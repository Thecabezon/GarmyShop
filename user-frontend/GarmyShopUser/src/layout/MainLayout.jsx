import React from 'react';
import NavLinksComponent from '../components/Header/NavLinksComponent';
import { LogoComponent } from '../components/Header/LogoComponent';
import { TopBarComponent } from '../components/Header/TopBarComponent';
import IconsComponent from '../components/Header/IconsComponent';
import '../styles/header.css';

export const MainLayout = ({ children, cartItems, setCartItems }) => {
  return (
    <>
      <header className="site-header"> {/* Añadimos una clase al header principal */}
        <TopBarComponent />
        <div className="main-header">
          <LogoComponent />
          <NavLinksComponent />
          <IconsComponent cartItems={cartItems} setCartItems={setCartItems} />
        </div>
      </header>
      <main className="content-area">{children}</main>
    </>
  );
};