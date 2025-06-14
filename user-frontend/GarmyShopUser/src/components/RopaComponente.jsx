import { Link } from "react-router-dom";

// ¡PUNTO CLAVE! Usas props para todo
export function RopaComponente(props) {
  return (
    <Link to={`/tienda/${props.id}`} className="ropa-card-link">
      <section className="ropa-card">
        <div className="ropa-imagen">
          <img
            src={props.imagen} // <- Usa props.imagen
            alt={props.nombre}  // <- Usa props.nombre
            onError={(e) => { e.target.src = `https://dummyimage.com/400x250/000/fff&text=${props.nombre}`; }}
          />
        </div>
        <div className="ropa-info">
          <h5>{props.nombre}</h5> {/* <- Usa props.nombre */}
          <p className="categoria">{props.categoria}</p> {/* <- Usa props.categoria */}
          <p className="precio">S/. {props.precio}</p> {/* <- Usa props.precio */}
          <button>Ver Más</button>
        </div>
      </section>
    </Link>
  );
}