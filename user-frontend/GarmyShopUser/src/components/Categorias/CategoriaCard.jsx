
import { Link } from "react-router-dom";

const CategoriaCard = ({ categoria }) => {
    return (
      <div className="categoria-card">
        <div className="categoria-imagen">
          <img src={categoria.imagen} alt={categoria.nombre} />
        </div>
        <div className="categoria-contenido">
          <h3>{categoria.nombre}</h3>
          <p>{categoria.descripcion}</p>
          
          <Link
            to={`/tienda?categoria=${categoria.id}`}
            className="ver-productos-btn"
          >
            Ver Productos
          </Link>
        </div>
      </div>
    );
  };
 
export default CategoriaCard;