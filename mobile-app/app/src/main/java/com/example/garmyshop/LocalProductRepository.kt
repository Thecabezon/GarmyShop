package com.example.garmyshop

import com.example.garmyshop.R
import com.example.garmyshop.data.model.Product

object LocalProductRepository {
    fun getProducts(): List<Product> = listOf(
        Product("Camiseta Básica", 25.99, "camisetas", imageUrl = "https://img.freepik.com/fotos-premium/chica-guapa-cabello-largo-camiseta-blanca-posando-sobre-fondo-rosa-claro-adorable-morena-aspecto-exitoso-profesional-actitud-positiva-vida_130153-987.jpg",isInWishlist = true),
        Product("Pantalon Jeans", 39.99, "pantalones", imageUrl = "https://www.migamarra.pe/cdn/shop/files/fotos_juliet_michi_tamano_app.009_4bd92809-26d9-4425-a8de-9a6e210aead8.jpg"),
        Product("Vestido Elegante", 249.99, "vestidos", imageUrl = "https://www.bellayvale.pe/wp-content/uploads/2022/06/Vestido-elegante-de-tul-manga-larga-rosa-1.jpg",isInWishlist = true),
        Product("Chaqueta deportiva", 69.99, "chaquetas", imageUrl = "https://images.nexusapp.co/assets/db/8e/d4/300212992.jpg"),
        Product("Accesorio moderno", 19.99, "accesorios", imageUrl = "https://img.kwcdn.com/product/fancy/e0df9253-7b34-492f-951b-c645bf93f2bf.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp"),
        Product("Bikini Verano", 89.99, "bikinis", imageUrl = "https://http2.mlstatic.com/D_NQ_NP_952392-MPE81890681567_012025-O-bikini-gris-y-negro-push-up-mujer-ropa-de-bano-verano.webp"),
        Product("Camiseta Blanca", 19.99, "camisetas", imageUrl = "https://static.e-stradivarius.net/assets/public/f585/474e/93e64c54b529/abe46ab9a848/02512171003-c/02512171003-c.jpg",isInWishlist = true),
        Product("Short Jeans", 34.99, "pantalones", imageUrl = "https://m.media-amazon.com/images/I/81GUypGdjlL._UY1000_.jpg"),
        Product("Vestido Floral", 129.99, "vestidos", imageUrl = "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/a880f51ed92f1f65af5a7fa65e59b97b.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp"),
        Product("Chaqueta de cuero", 149.99, "chaquetas", imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsMcq1JLgyNteqvaGN_XQKmksphzt45Thffo4orZ8qa2oRTeEpTTt9PHJcpQPCC_DFtIk&usqp=CAU"),
        Product("Collar Dorado", 39.99, "accesorios", imageUrl = "https://http2.mlstatic.com/D_NQ_NP_855116-MPE83257827546_042025-O-set-lujo-collar-aretes-gotas-dorado-feng-shui-minimalista.webp"),
        Product("Bikini Rojo", 99.99, "bikinis", imageUrl = "https://rimage.ripley.com.pe/home.ripley/Attachment/MKP/3467/PMP20000415528/full_image-1.jpeg"),
        Product("Zapatillas deportivas", 129.99, "calzados", imageUrl = "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/1a43f45b6d04d64d1ccb7c55a65dc6bb.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp")
    )
}
