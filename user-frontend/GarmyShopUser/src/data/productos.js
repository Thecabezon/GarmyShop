// src/data/productos.js

export const productos = [
  // ======================================================
  // --- BLUSAS, POLOS Y TOPS (Mujer) ---
  // ======================================================
  {
    cod: 101,
    nombre: "Blusa Clásica Manga 3/4",
    descripcion: "Elegante blusa de seda con cuello en V, perfecta para la oficina o un look casual.",
    departamento: "Mujer",
    tipoPrenda: "Blusa",
    marca: "Zara",
    precio: 39.99,
    imagen: "https://m.media-amazon.com/images/I/61TQd-XbnHL._AC_UY1000_.jpg",
    combinaCon: ['Pantalón', 'Jeans', 'Blazer']
  },
  {
    cod: 102,
    nombre: "Polo Básico de Algodón Pima",
    descripcion: "Polo de algodón pima ultrasuave, un básico imprescindible en cualquier armario.",
    departamento: "Mujer",
    tipoPrenda: "Polo",
    marca: "H&M",
    precio: 19.90,
    imagen: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Ffe%2F63%2Ffe6322b72455913e8d97525f69e96e082f4e3c23.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]",
    combinaCon: ['Jeans', 'Shorts', 'Leggings']
  },
  {
    cod: 103,
    nombre: "Top de Tirantes Satinado",
    descripcion: "Top ligero y elegante con acabado satinado, ideal para combinar con blazers o para una salida nocturna.",
    departamento: "Mujer",
    tipoPrenda: "Top",
    marca: "Vogue",
    precio: 29.50,
    imagen: "https://shop.mango.com/assets/rcs/pics/static/T7/fotos/S/77054013_48.jpg?imwidth=2048&imdensity=1&ts=1724348132102",
    combinaCon: ['Pantalón', 'Blazer', 'Maxi falda']
  },
  {
    cod: 104,
    nombre: "Blusa Campesina con Bordados",
    descripcion: "Blusa de estilo bohemio con hombros descubiertos y detalles bordados florales.",
    departamento: "Mujer",
    tipoPrenda: "Blusa",
    marca: "H&M",
    precio: 68.00,
    imagen: "https://m.media-amazon.com/images/I/61kBS9-MJZL._AC_SL1080_.jpg",
    combinaCon: ['Jeans', 'Shorts', 'Maxi falda']
  },
  {
    cod: 105,
    nombre: "Cafarena de Cuello Alto",
    descripcion: "Cafarena acanalada de tejido elástico que se ajusta perfectamente al cuerpo, ideal para usar bajo otras prendas.",
    departamento: "Mujer",
    tipoPrenda: "Cafarena",
    marca: "Uniqlo",
    precio: 25.00,
    imagen: "https://ae01.alicdn.com/kf/S11cf505076a548acb262c9db137fa818w.jpg_640x640q90.jpg",
    combinaCon: ['Blazer', 'Cárdigan', 'Pantalón']
  },
  {
    cod: 106,
    nombre: "Polo con Logo Estampado",
    descripcion: "Polo casual con el logo clásico de la marca en el pecho.",
    departamento: "Mujer",
    tipoPrenda: "Polo",
    marca: "Levi's",
    precio: 35.00,
    imagen: "https://www.levi.com.pe/arquivos/ids/192231-300-400/173691993_Frente.jpg?v=638202575232870000",
    combinaCon: ['Jeans', 'Shorts']
  },

  // ======================================================
  // --- VESTIDOS Y ENTERIZOS (Mujer) ---
  // ======================================================
  {
    cod: 201,
    nombre: "Maxi Vestido Floral",
    descripcion: "Vestido largo y fluido con estampado floral, ideal para eventos de día o vacaciones.",
    departamento: "Mujer",
    tipoPrenda: "Maxi vestido",
    marca: "Vogue",
    precio: 75.50,
    imagen: "https://www.modashei.com/wp-content/uploads/2022/07/2-4.jpg",
    combinaCon: ['Sandalias', 'Sombrero']
  },
  {
    cod: 202,
    nombre: "Enterizo Corto de Lino",
    descripcion: "Enterizo fresco y cómodo, con cinturón ajustable para realzar la figura.",
    departamento: "Mujer",
    tipoPrenda: "Enterizo",
    marca: "Zara",
    precio: 55.00,
    imagen: "https://i.pinimg.com/736x/8f/3e/26/8f3e261e0d37651a37c98f822ac26f63.jpg",
    combinaCon: ['Sandalias', 'Lentes']
  },
  {
    cod: 203,
    nombre: "Vestido Camisero de Rayas",
    descripcion: "Un vestido versátil que combina la comodidad de una camisa con un estilo chic. Perfecto para la oficina.",
    departamento: "Mujer",
    tipoPrenda: "Vestido",
    marca: "H&M",
    precio: 49.99,
    imagen: "https://i.pinimg.com/564x/0a/63/c4/0a63c467e4e16444a8a2575677a28e93.jpg",
    combinaCon: ['Blazer', 'Bolsos de mano']
  },
  {
    cod: 204,
    nombre: "Vestido de Noche Ajustado",
    descripcion: "Vestido corto y ajustado, con un escote sutil, ideal para una fiesta o cena elegante.",
    departamento: "Mujer",
    tipoPrenda: "Vestido",
    marca: "Vogue",
    precio: 95.00,
    imagen: "https://i.etsystatic.com/20998842/r/il/6b4293/4688622143/il_570xN.4688622143_tfle.jpg",
    combinaCon: ['Tacones', 'Bolsos de mano']
  },

  // ======================================================
  // --- PANTALONES (Unisex / Mujer) ---
  // ======================================================
  {
    cod: 301,
    nombre: "Jeans Skinny de Tiro Alto",
    descripcion: "Jeans ajustados que estilizan tus piernas, fabricados con mezclilla elástica de alta calidad.",
    departamento: "Mujer",
    tipoPrenda: "Jeans",
    marca: "Levi's",
    precio: 89.90,
    imagen: "https://www.levi.com.mx/media/catalog/product/5/2/52797-0066_1_1.jpg?quality=80&bg-color=255,255,255&fit=bounds&height=700&width=525&canvas=525:700",
    combinaCon: ['Blusa', 'Polo', 'Chaqueta']
  },
  {
    cod: 302,
    nombre: "Leggings Deportivos",
    descripcion: "Leggings de alta compresión con control de humedad, para tus entrenamientos más intensos.",
    departamento: "Unisex",
    tipoPrenda: "Leggings",
    marca: "Nike",
    precio: 65.00,
    imagen: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e05b533e-e0d5-4521-a434-5838036d04d8/mallas-de-tiro-medio-dri-fit-universa-7-8-R01gM2.png",
    combinaCon: ['Top', 'Zapatillas']
  },
  {
    cod: 303,
    nombre: "Pantalón de Tela Palazzo",
    descripcion: "Pantalón de pierna ancha, elegante y cómodo, con una caída fluida que aporta movimiento.",
    departamento: "Mujer",
    tipoPrenda: "Pantalón",
    marca: "Zara",
    precio: 49.95,
    imagen: "https://i.pinimg.com/originals/1e/8a/a5/1e8aa5c5031b25052973801267b2a6f2.jpg",
    combinaCon: ['Blusa', 'Top', 'Blazer']
  },
  {
    cod: 304,
    nombre: "Shorts de Jean con Rotos",
    descripcion: "Shorts de tiro alto con detalles desgastados, perfectos para un look de verano relajado.",
    departamento: "Mujer",
    tipoPrenda: "Shorts",
    marca: "Levi's",
    precio: 59.90,
    imagen: "https://www.levi.com.pe/arquivos/ids/187974-300-400/563270258_Frente.jpg?v=638010899479300000",
    combinaCon: ['Polo', 'Top', 'Sandalias']
  },
  {
    cod: 305,
    nombre: "Pantalón Cargo Urbano",
    descripcion: "Pantalón de estilo cargo con múltiples bolsillos, ideal para un look urbano y funcional.",
    departamento: "Unisex",
    tipoPrenda: "Pantalón",
    marca: "Nike",
    precio: 78.00,
    imagen: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c735956f-09a2-475c-a19c-0d3a5a7538a7/pantalon-cargo-sportswear-club-fleece-X2vjDF.png",
    combinaCon: ['Polo', 'Zapatillas']
  },

  // ======================================================
  // --- BLAZERS Y ABRIGOS (Mujer) ---
  // ======================================================
  {
    cod: 401,
    nombre: "Blazer Estructurado",
    descripcion: "Blazer con corte clásico y hombreras definidas. Eleva cualquier atuendo al instante.",
    departamento: "Mujer",
    tipoPrenda: "Blazer",
    marca: "Vogue",
    precio: 110.00,
    imagen: "https://ae01.alicdn.com/kf/S09f83733575c4af1b3334812f8660c6cb.jpg_640x640Q90.jpg_.webp",
    combinaCon: ['Pantalón', 'Jeans', 'Vestido']
  },
  {
    cod: 402,
    nombre: "Abrigo Clásico de Lana",
    descripcion: "Abrigo largo de paño de lana, una pieza atemporal y elegante para el invierno.",
    departamento: "Mujer",
    tipoPrenda: "Abrigo",
    marca: "H&M",
    precio: 150.00,
    imagen: "https://lp2.hm.com/hmgoepprod?set=format%5Bwebp%5D%2Cquality%5B79%5D%2Csource%5B%2F80%2F62%2F80628286a11e839e9432e6b0d918236df529ed45.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5Bladies_coats_longcoats%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url%5Bfile%3A%2Fproduct%2Fmain%5D",
    combinaCon: ['Pashmina', 'Botas']
  },
  {
    cod: 403,
    nombre: "Chaqueta de Cuero Biker",
    descripcion: "La clásica chaqueta de cuero con cremalleras asimétricas, un ícono de estilo rebelde.",
    departamento: "Unisex",
    tipoPrenda: "Chaqueta",
    marca: "AllSaints",
    precio: 198.00,
    imagen: "https://images.allsaints.com/products/900/WL027X/5/WL027X-5-1.jpg",
    combinaCon: ['Jeans', 'Vestido', 'Botas']
  },
  {
    cod: 404,
    nombre: "Cárdigan Largo de Punto",
    descripcion: "Cárdigan abierto y largo, ideal para crear capas en tu outfit en días frescos.",
    departamento: "Mujer",
    tipoPrenda: "Cárdigan",
    marca: "H&M",
    precio: 35.50,
    imagen: "https://www.dhresource.com/0x0/f2/albu/g22/M00/B2/B1/rBVaEmL-GvSAY1k3AAEZN7gJ2wU315.jpg",
    combinaCon: ['Polo', 'Jeans', 'Blusa']
  },
  {
    cod: 405,
    nombre: "Blazer de Lino",
    descripcion: "Blazer ligero de lino, perfecto para un look de oficina veraniego o un evento casual.",
    departamento: "Mujer",
    tipoPrenda: "Blazer",
    marca: "Zara",
    precio: 85.00,
    imagen: "https://www.linoandco.com/cdn/shop/files/LINO_CO-BLAZER-NATURAL-D-01.jpg?v=1701389270",
    combinaCon: ['Pantalón', 'Shorts', 'Vestido']
  },


  // ======================================================
  // --- ACCESORIOS (Unisex / Mujer) ---
  // ======================================================

  {
    cod: 502,
    nombre: "Lentes de Sol Cat-Eye",
    descripcion: "Lentes de sol con montura estilo 'cat-eye' y protección UV400, un toque de glamour retro.",
    departamento: "Mujer",
    tipoPrenda: "Lentes",
    marca: "Ray-Ban",
    precio: 125.00,
    imagen: "https://www.optimania.es/133069-large_default/gafas-de-sol-ray-ban-cat-eye-rb4126-601-32.jpg"
  },
  {
    cod: 503,
    nombre: "Bolso Tote de Cuero",
    descripcion: "Bolso grande y espacioso, fabricado en cuero genuino, perfecto para el día a día.",
    departamento: "Mujer",
    tipoPrenda: "Bolsos de mano",
    marca: "Uniqlo",
    precio: 250.00,
    imagen: "https://falabella.scene7.com/is/image/FalabellaPE/gsc_118432363_2120038_1?wid=800&hei=800&qlt=70"
  },
  {
    cod: 504,
    nombre: "Sombrero de Paja Fedora",
    descripcion: "Sombrero clásico de estilo fedora, ideal para protegerte del sol con mucho estilo.",
    departamento: "Unisex",
    tipoPrenda: "Sombrero",
    marca: "Brixton",
    precio: 55.00,
    imagen: "https://www.kadu.cl/cdn/shop/products/3_0af84784-a82f-410a-8677-27e1f486d30f.jpg?v=1658422178"
  }
];