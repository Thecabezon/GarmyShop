import { useNavigate } from "react-router-dom";

export function RopaComponente(props) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/tienda/${props.id}`);
    }
  return (
    <section className="ropa-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="ropa-imagen">
        <img
          src={props.imagen}
          alt={props.nombre}
          onError={(e) => {
            e.target.src = `https://dummyimage.com/400x250/000/fff&text=${props.nombre}`;
          }}
        />
      </div>
      <div className="ropa-info">
        <h5>{props.nombre}</h5>
        <p className="categoria">{props.categoria}</p>
        <p className="precio">S/. {props.precio}</p>
        <button>Ver Más</button>
      </div>
    </section>
  );
}

export default RopaComponente;
