// src/layout/MainLayout.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/MainLayout.css';

function MainLayout({ children }) {
  const location = useLocation();

  // Rutas que requieren diseño full-width (sin centrado)
  const fullWidthRoutes = ['/', '/marcas'];
  const isFullWidth = fullWidthRoutes.includes(location.pathname) || location.pathname.startsWith('/tienda/');

  return (
    <div className="main-layout-container">
      <main className={isFullWidth ? '' : 'main-content'}>
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
