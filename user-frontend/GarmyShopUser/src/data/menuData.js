// data/menuData.js
import { productos } from './productos'; // Importamos nuestros productos

// 1. Obtenemos una lista de todas las marcas únicas de nuestros productos
const todasLasMarcas = [...new Set(productos.map(p => p.marca))];

// 2. Creamos la columna de marcas dinámicamente
const marcasColumn = {
  title: 'COMPRAR POR MARCA',
  links: todasLasMarcas.sort() // Las ordenamos alfabéticamente
};

// 3. Definimos el resto de la estructura del menú como antes
export const menuData = {
  ropa: [
    {
      title: 'BLUSAS Y POLOS',
      links: ['Blusa manga 3/4', 'Blusa manga cero', 'Blusa manga corta', 'Blusa manga larga', 'Cafarena', 'Polivestidos', 'Polo', 'Top'],
    },
    {
      title: 'VESTIDOS Y ENTERIZOS',
      links: ['Enterizos', 'Maxi falda', 'Maxi vestido', 'Vestido manga 3/4', 'Vestido manga cero', 'Vestido manga corta', 'Vestido manga larga', 'Vestido tiras'],
    },
    {
      title: 'PANTALONES',
      links: ['Jeans', 'Leggings', 'Pantalón', 'Shorts'],
    },
    {
      title: 'BLAZERS Y ABRIGOS',
      links: ['Abrigo', 'Blazer', 'Cárdigan', 'Casaca', 'Chaleco', 'Chaqueta', 'Chompa', 'Corta viento', 'Poncho', 'Saco'],
    },
    // 4. Añadimos nuestra columna de marcas generada dinámicamente
    marcasColumn
  ],
  ofertas: [
    {
      title: 'OFERTAS DE TEMPORADA',
      links: ['Descuentos de Verano', 'Liquidación de Invierno', 'Ofertas Flash'],
    },
    {
      title: 'OFERTAS POR CATEGORÍA',
      links: ['Vestidos en Oferta', 'Pantalones en Oferta', 'Accesorios en Oferta'],
    }
  ],
  // También podrías tener un menú solo para accesorios si lo necesitas
  accesorios: [
    {
        title: 'BOLSOS Y CARTERAS',
        links: ['Bolsos de mano', 'Mochilas', 'Billeteras']
    },
    {
        title: 'JOYERÍA',
        links: ['Collares', 'Aretes', 'Pulseras']
    },
    {
        title: 'OTROS',
        links: ['Pashmina', 'Colettes', 'Lazo', 'Lentes']
    }
  ]
};