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
            onError={(e) => { e.target.src = `https://i.pinimg.com/originals/f2/91/88/f29188204ca351f2b0cb604b51fc409a.jpg${props.nombre}`; }}
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