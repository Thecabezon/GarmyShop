const CategoriaCard = ({ categoria }) => {
    return (
      <div className="categoria-card">
        <div className="categoria-imagen">
          <img src={categoria.imagen} alt={categoria.nombre} />
        </div>
        <div className="categoria-contenido">
          <h3>{categoria.nombre}</h3>
          <p>{categoria.descripcion}</p>
          <button 
            onClick={() => window.location.href = `/productos?categoria=${categoria.id}`}
            className="ver-productos-btn"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  };
  
  export default CategoriaCard;