import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/MainLayout.css';

function MainLayout({ children }) {
  const location = useLocation();

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
