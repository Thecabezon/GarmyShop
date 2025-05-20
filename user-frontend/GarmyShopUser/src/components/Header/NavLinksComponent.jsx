import { NavLink } from 'react-router-dom';

const NavLinksComponent = () => {
  return (
    <nav className="nav-links">
      <NavLink to="/">Inicio</NavLink>
      <NavLink to="/tienda">Productos</NavLink>
      <NavLink to="/marca">Marcas</NavLink>
      <NavLink to="/categoria">Categorías</NavLink>
      <NavLink to="/ofertas">Ofertas</NavLink>
      <NavLink to="/nosotros">Nosotros</NavLink>
      <NavLink to="/contacto">Contacto</NavLink>
    </nav>
  );
};

export default NavLinksComponent;