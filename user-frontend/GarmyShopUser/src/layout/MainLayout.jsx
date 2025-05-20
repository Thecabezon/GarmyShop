import NavLinksComponent from '../components/Header/NavLinksComponent';
import { LogoComponent } from '../components/Header/LogoComponent';
import '../styles/header.css';

export const MainLayout = () => {
  return (
    <header>
      <div className="top-bar">
        <p>Envíos gratis a todo el país</p>
      </div>
      <div className="main-header">
        <div className="logo-container">
          <h1 className="logo">GarmyShop</h1>
          <p className="logo-description">Your Style, No Label</p>
        </div>
        <NavLinksComponent />
      </div>
    </header>
  );
};