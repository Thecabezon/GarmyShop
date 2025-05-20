import { NavLink } from 'react-router-dom';

const NavLinksComponent = () => {
  return (
    <nav className="nav-links flex gap-6 text-lg font-medium"> {/* Añadido Tailwind para espaciado */}
      <NavLink to="/" className="hover:text-blue-600 transition duration-200">Inicio</NavLink>
      <NavLink to="/tienda" className="hover:text-blue-600 transition duration-200">Productos</NavLink>
      <NavLink to="/marca" className="hover:text-blue-600 transition duration-200">Marcas</NavLink>
      <NavLink to="/categoria" className="hover:text-blue-600 transition duration-200">Categorías</NavLink>
      <NavLink to="/ofertas" className="hover:text-blue-600 transition duration-200">Ofertas</NavLink>
      <NavLink to="/nosotros" className="hover:text-blue-600 transition duration-200">Nosotros</NavLink>
      <NavLink to="/contacto" className="hover:text-blue-600 transition duration-200">Contacto</NavLink>
      {/* Nuevo enlace para el buscador */}
      <NavLink to="/buscar" className="hover:text-blue-600 transition duration-200">Buscador</NavLink>
    </nav>
  );
};

export default NavLinksComponent;
