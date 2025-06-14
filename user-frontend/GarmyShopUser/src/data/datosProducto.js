// src/data/datosProducto.js

// Datos para el producto que se está viendo en detalle
export const productoDetalle = {
  id: "blu06013gsa",
  nombre: "Blusa Manga 3/4 Acampanada Forrada",
  precio: 69.95,
  precioAnterior: 139.90,
  sku: "BLU06013GSA",
  categoria: {
    nombre: "Blusas",
    slug: "blusas"
  },
  imagenes: [
    "https://i.imgur.com/H2a5j2c.png", // Imagen principal de tu ejemplo
    "https://i.imgur.com/N6vaAas.png", // Imagen de la modelo de espalda
    "https://i.imgur.com/eP3d1lP.png", // Imagen de la modelo de lado
    "https://i.imgur.com/xIe0b9b.png", // Otra imagen de la modelo
    "https://i.imgur.com/uTgmJjD.png"  // Una blusa similar en otro color
  ],
  tallasDisponibles: [
    { talla: 'S', disponible: true },
    { talla: 'M', disponible: true },
    { talla: 'L', disponible: false }, // Talla no disponible
    { talla: 'XL', disponible: false },
  ],
  coloresDisponibles: [
    { nombre: 'Beige', codigoHex: '#f2e8d9' },
    { nombre: 'Blanco', codigoHex: '#ffffff' },
    { nombre: 'Naranja', codigoHex: '#ff7a5a' },
    { nombre: 'Verde', codigoHex: '#90ee90' },
  ],
  descripcion: "Nuestra blusa es una fusión perfecta de elegancia y modernidad. El escote ojal aporta un toque de sensualidad sutil y feminidad, mientras que las mangas 3/4 acampanadas añaden un elemento de drama y movimiento al diseño. La combinación de gasa de puntos y gasa crepé crea un contraste visual fascinante, elevando la prenda a un nivel superior de sofisticación. Completamente forrada para garantizar comodidad y un acabado impecable, esta blusa te hará sentir segura y radiante. Cada detalle ha sido cuidadosamente diseñado para crear una pieza que equilibra la delicadeza con un estilo contemporáneo. ¡Déjate cautivar por la elegancia y el encanto de esta blusa excepcional!",
  detalles: "Composición: 100% Poliéster. Cuidado: Lavar a máquina con agua fría, no usar lejía, secar en secadora a baja temperatura.",
  infoEnvio: "Envío estándar de 3 a 5 días hábiles. Envío express disponible por un costo adicional. Devoluciones gratuitas dentro de los 30 días posteriores a la compra."
};

// Datos para la sección de productos recomendados
export const productosRecomendados = [
  {
    cod: 101,
    nombre: "Blusa Floral de Verano",
    categoria: "Blusas",
    precio: 59.90,
    imagen: "https://i.imgur.com/sSwn6UK.jpeg"
  },
  {
    cod: 102,
    nombre: "Top de Tirantes Satinado",
    categoria: "Blusas",
    precio: 45.00,
    imagen: "https://i.imgur.com/O6a09a5.jpeg"
  },
  {
    cod: 103,
    nombre: "Camisa de Lino Blanca",
    categoria: "Blusas",
    precio: 89.90,
    imagen: "https://i.imgur.com/tL45N5c.jpeg"
  },
  {
    cod: 104,
    nombre: "Blusa con Lazo al Cuello",
    categoria: "Blusas",
    precio: 75.50,
    imagen: "https://i.imgur.com/pYJ38jF.jpeg"
  }
];