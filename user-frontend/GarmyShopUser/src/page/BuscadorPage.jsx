import React, { useState, useEffect } from 'react';
import '../styles/Buscador.css';

const BuscadorPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Datos de categorías (del componente CategoriasPage)
  const categorias = [
    {
      id: 1,
      nombre: "Polos",
      descripcion: "Encuentra los mejores polos para tu estilo",
      imagen: "https://elricostore.com/wp-content/uploads/2022/05/manga-larga-blanco.png",
      tipo: "categoria"
    },
    {
      id: 2,
      nombre: "Pantalones",
      descripcion: "Variedad de pantalones para cada ocasión",
      imagen: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/6ac8df30-8015-480e-8529-6f917715753c.__CR0,0,970,600_PT0_SX970_V1___.jpg",
      tipo: "categoria"
    },
    {
      id: 3,
      nombre: "Faldas",
      descripcion: "Faldas con diseños exclusivos",
      imagen: "https://i.pinimg.com/originals/fa/a6/03/faa603c4da9748094b22c076d0b89c20.jpg",
      tipo: "categoria"
    },
    {
      id: 4,
      nombre: "Vestidos",
      descripcion: "Vestidos para toda ocasión",
      imagen: "https://tissini.com/blog/wp-content/uploads/2022/07/vestidos-de-verano-para-mujer-disenos-en-tendencia.jpg",
      tipo: "categoria"
    },
    {
      id: 5,
      nombre: "Casacas",
      descripcion: "Casacas para mantenerte abrigado con estilo",
      imagen: "https://ae01.alicdn.com/kf/S76cde18f804d426aadbd0200ef2ebefd3/Men-s-Down-Jacket-Warm-Winter-Men-Down-Jacket-Designer-Clothes-Men-Duck-Down-Padding-Jackets.jpg",
      tipo: "categoria"
    },
    {
      id: 6,
      nombre: "Shorts",
      descripcion: "Shorts cómodos y a la moda",
      imagen: "https://us.123rf.com/450wm/opolja/opolja1808/opolja180800166/106720334-grupo-de-amigos-divirti%C3%A9ndose-corriendo-por-la-playa-al-atardecer.jpg?ver=6",
      tipo: "categoria"
    },
    {
      id: 7,
      nombre: "Chaquetas",
      descripcion: "Chaquetas elegantes para completar tu look",
      imagen: "https://casacasdecuero.pe/storage/2022/01/CAZADORAS-DE-CUERO-PARA-HOMBRES-2022-3.jpg",
      tipo: "categoria"
    },
    {
      id: 8,
      nombre: "Pijamas",
      descripcion: "Pijamas cómodos para tu descanso",
      imagen: "https://i5.walmartimages.com/asr/7801d9c6-2881-4cda-a517-88600d646206.5e5c710e330347867aa113b73462ed1c.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
      tipo: "categoria"
    },
    {
      id: 9,
      nombre: "Camisas",
      descripcion: "Camisas para un look formal o casual",
      imagen: "https://static-abcblogs.abc.es/wp-content/uploads/sites/203/2017/10/botones-diferencia.jpg",
      tipo: "categoria"
    }
  ];

  // Datos de productos (del componente TiendaPage)
  const productos = [
    {
      id: 1,
      nombre: "Camisa",
      descripcion: "Camisa de algodón",
      categoria: "Hombre",
      precio: 20.0,
      imagen: "https://oechsle.vteximg.com.br/arquivos/ids/19954465/imageUrl_1.jpg?v=638679871644900000",
      tipo: "producto"
    },
    {
      id: 2,
      nombre: "Pantalón",
      descripcion: "Pantalón de mezclilla",
      categoria: "Mujer",
      precio: 35.0,
      imagen: "https://i5-mx.walmartimages.com/mg/gm/3pp/asr/c7d1ca57-5ca7-4719-9f2e-b39cfcc7523e.b2a9fb89801c5151a3ee9be32d57e185.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
      tipo: "producto"
    },
    {
      id: 3,
      nombre: "Chaqueta",
      descripcion: "Chaqueta de cuero",
      categoria: "Mujer",
      precio: 50.0,
      imagen: "https://img.kwcdn.com/product/fancy/82e84b64-8c02-4ebd-8c71-cd75dd93dfd8.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp",
      tipo: "producto"
    },
    {
      id: 4,
      nombre: "Vestido",
      descripcion: "Vestido elegante",
      categoria: "Mujer",
      precio: 75.0,
      imagen: "https://www.atributo.co/cdn/shop/files/232.png?crop=center&height=803&v=1693517212&width=600",
      tipo: "producto"
    },
    {
      id: 5,
      nombre: "Pijamas",
      descripcion: "Pijamas de algodón",
      categoria: "Unisex",
      precio: 60.0,
      imagen: "https://i5.walmartimages.com/asr/0045ee17-0bb6-4e9f-95b6-656bd3fa3c13.1d9536f7e1ce704368299c19bfe6adde.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
      tipo: "producto"
    },
    {
      id: 6,
      nombre: "Falda",
      descripcion: "Falda casual",
      categoria: "Mujer",
      precio: 40.0,
      imagen: "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/4aa36d6a87303a356affab5c5271b91c.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp",
      tipo: "producto"
    },
    {
      id: 7,
      nombre: "Camisa Formal",
      descripcion: "Camisa para oficina",
      categoria: "Hombre",
      precio: 30.0,
      imagen: "https://ss241.liverpool.com.mx/xl/1143867923.jpg",
      tipo: "producto"
    },
    {
      id: 8,
      nombre: "Chaqueta Deportiva",
      descripcion: "Chaqueta para running",
      categoria: "Unisex",
      precio: 55.0,
      imagen: "https://images-na.ssl-images-amazon.com/images/I/51qCkBgTELL._AC_UL375_SR375,375_.jpg",
      tipo: "producto"
    },
    {
      id: 9,
      nombre: "Pantalón Corto",
      descripcion: "Pantalón corto para verano",
      categoria: "Hombre",
      precio: 25.0,
      imagen: "https://img.kwcdn.com/product/fancy/a7b14dde-d561-4db2-846f-52e0e1f2d8c4.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp",
      tipo: "producto"
    }
  ];

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    
    // Buscar en categorías
    const categoriasResults = categorias.filter(categoria => 
      categoria.nombre.toLowerCase().includes(term) || 
      categoria.descripcion.toLowerCase().includes(term)
    );
    
    // Buscar en productos
    const productosResults = productos.filter(producto => 
      producto.nombre.toLowerCase().includes(term) || 
      producto.descripcion.toLowerCase().includes(term) ||
      producto.categoria.toLowerCase().includes(term)
    );
    
    // Combinar resultados
    const combinedResults = [...categoriasResults, ...productosResults];
    setSearchResults(combinedResults);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleVerDetalle = (item) => {
    if (item.tipo === 'categoria') {
      window.location.href = `/tienda?categoria=${item.id}`;
    } else {
      window.location.href = `/tienda/${item.id}`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Banner */}
      <div className="bg-slate-700 text-white text-center py-2 text-sm font-medium tracking-wide">
        Encuentra todo lo que buscas con nuestro buscador
      </div>

      {/* Contenedor principal */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-slate-800 mb-8">
          Buscador de Productos y Categorías
        </h1>

        {/* Buscador */}
        <div className="flex max-w-2xl mx-auto bg-white border border-slate-300 rounded-full shadow-md overflow-hidden focus-within:ring-2 focus-within:ring-slate-400 transition duration-300">
          <input
            type="text"
            placeholder="Buscar productos o categorías..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-grow px-6 py-3 text-lg focus:outline-none rounded-l-full"
          />
          <button
            onClick={handleSearch}
            className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 font-semibold transition-colors duration-300 rounded-r-full"
          >
            Buscar
          </button>
        </div>

        {/* Resultados o mensajes */}
        <div className="mt-10 space-y-6">
          {!searchTerm && searchResults.length === 0 && (
            <p className="text-center text-slate-500 italic">
              Ingresa un término para empezar a buscar.
            </p>
          )}

          {searchResults.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
              <div className="bg-slate-100 px-6 py-4 border-b border-slate-300">    
                <h2 className="text-xl font-semibold text-slate-700">
                  Resultados de la búsqueda ({searchResults.length})
                </h2>
              </div>
              <ul className="divide-y divide-slate-200">
                {searchResults.map((result) => (
                  <li
                    key={`${result.tipo}-${result.id}`}
                    className="p-4 hover:bg-slate-50 transition-colors flex items-center cursor-pointer"
                    onClick={() => handleVerDetalle(result)}
                  >
                    <div className="w-16 h-16 mr-4 flex-shrink-0">
                      <img 
                        src={result.imagen} 
                        alt={result.nombre} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-800 text-lg font-medium">{result.nombre}</span>
                        <span className={`text-sm px-3 py-1 rounded-full capitalize ${
                          result.tipo === 'categoria' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {result.tipo}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm mt-1">{result.descripcion}</p>
                      {result.tipo === 'producto' && (
                        <p className="text-slate-700 font-semibold mt-1">
                          S/. {result.precio.toFixed(2)} - {result.categoria}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {searchResults.length === 0 && searchTerm && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 text-center">
              <p className="text-lg text-slate-600">
                No se encontraron resultados para "<span className="font-semibold">{searchTerm}</span>"
              </p>
              <p className="text-slate-500 mt-2">
                Intenta con otros términos o revisa la ortografía.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { BuscadorPage };
export default BuscadorPage;