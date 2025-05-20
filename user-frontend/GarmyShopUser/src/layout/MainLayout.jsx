import NavLinksComponent from '../components/Header/NavLinksComponent';
import { LogoComponent } from '../components/Header/LogoComponent';
import { TopBarComponent } from '../components/Header/TopBarComponent';
import IconsComponent from '../components/Header/IconsComponent';
import '../styles/header.css';

export const MainLayout = () => {
  
  return (
    <header>
      <TopBarComponent />
      <div className="main-header">
        <LogoComponent />
        <NavLinksComponent />
        <IconsComponent />
      </div>
    </header>
  );
  
};