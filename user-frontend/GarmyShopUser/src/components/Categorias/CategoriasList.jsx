import CategoriaCard from './CategoriaCard';

const CategoriasList = ({ categorias }) => {
  return (
    <div className="categorias-grid">
      {categorias.map((categoria) => (
        <CategoriaCard 
          key={categoria.id} 
          categoria={categoria} 
        />
      ))}
    </div>
  );
};

export default CategoriasList;