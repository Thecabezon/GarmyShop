package com.example.garmyshop

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.widget.ViewPager2
import com.example.garmyshop.CarouselAdapter
import com.example.garmyshop.adapter.ProductAdapter
import com.example.garmyshop.data.model.Product
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator

class MainActivity : AppCompatActivity() {

    private lateinit var viewPager: ViewPager2
    private lateinit var tabLayout: TabLayout
    private lateinit var carouselAdapter: CarouselAdapter
    private lateinit var productRecyclerView: RecyclerView
    private lateinit var productAdapter: ProductAdapter
    private lateinit var categoryIconsLayout: LinearLayout

    private val handler = Handler(Looper.getMainLooper())
    private val images = listOf(
        R.drawable.carrusel_1,
        R.drawable.carrusel_2,
        R.drawable.carrusel_3
    )

    // ✅ Productos locales
    private val allProducts = listOf(
        Product("Camiseta Básica", 25.99, "camisetas", imageUrl = "https://img.freepik.com/fotos-premium/chica-guapa-cabello-largo-camiseta-blanca-posando-sobre-fondo-rosa-claro-adorable-morena-aspecto-exitoso-profesional-actitud-positiva-vida_130153-987.jpg"),
        Product("Pantalon Jeans", 39.99, "pantalones", imageUrl = "https://www.migamarra.pe/cdn/shop/files/fotos_juliet_michi_tamano_app.009_4bd92809-26d9-4425-a8de-9a6e210aead8.jpg"),
        Product("Vestido Elegante", 249.99, "vestidos", imageUrl = "https://www.bellayvale.pe/wp-content/uploads/2022/06/Vestido-elegante-de-tul-manga-larga-rosa-1.jpg"),
        Product("Chaqueta deportiva", 69.99, "chaquetas", imageUrl = "https://images.nexusapp.co/assets/db/8e/d4/300212992.jpg"),
        Product("Accesorio moderno", 19.99, "accesorios", imageUrl = "https://img.kwcdn.com/product/fancy/e0df9253-7b34-492f-951b-c645bf93f2bf.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp"),
        Product("Bikini Verano", 89.99, "bikinis", imageUrl = "https://http2.mlstatic.com/D_NQ_NP_952392-MPE81890681567_012025-O-bikini-gris-y-negro-push-up-mujer-ropa-de-bano-verano.webp"),
        Product("Camiseta Blanca", 19.99, "camisetas", imageUrl = "https://static.e-stradivarius.net/assets/public/f585/474e/93e64c54b529/abe46ab9a848/02512171003-c/02512171003-c.jpg"),
        Product("Short Jeans", 34.99, "pantalones", imageUrl = "https://m.media-amazon.com/images/I/81GUypGdjlL._UY1000_.jpg"),
        Product("Vestido Floral", 129.99, "vestidos", imageUrl = "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/a880f51ed92f1f65af5a7fa65e59b97b.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp"),
        Product("Chaqueta de cuero", 149.99, "chaquetas", imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsMcq1JLgyNteqvaGN_XQKmksphzt45Thffo4orZ8qa2oRTeEpTTt9PHJcpQPCC_DFtIk&usqp=CAU"),
        Product("Collar Dorado", 39.99, "accesorios", imageUrl = "https://http2.mlstatic.com/D_NQ_NP_855116-MPE83257827546_042025-O-set-lujo-collar-aretes-gotas-dorado-feng-shui-minimalista.webp"),
        Product("Bikini Rojo", 99.99, "bikinis", imageUrl = "https://rimage.ripley.com.pe/home.ripley/Attachment/MKP/3467/PMP20000415528/full_image-1.jpeg"),
        Product("Zapatillas deportivas", 129.99, "calzados", imageUrl = "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/1a43f45b6d04d64d1ccb7c55a65dc6bb.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp")
    )

    private val autoScrollRunnable = object : Runnable {
        override fun run() {
            if (::viewPager.isInitialized && carouselAdapter.itemCount > 0) {
                val nextItem = (viewPager.currentItem + 1) % carouselAdapter.itemCount
                viewPager.setCurrentItem(nextItem, true)
                handler.postDelayed(this, 3000)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Carrusel
        viewPager = findViewById(R.id.carruselViewPager)
        tabLayout = findViewById(R.id.tabLayout)
        carouselAdapter = CarouselAdapter(images)
        viewPager.adapter = carouselAdapter

        TabLayoutMediator(tabLayout, viewPager) { tab, _ ->
            tab.setCustomView(R.layout.custom_tab)
        }.attach()

        viewPager.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                super.onPageSelected(position)
                for (i in 0 until tabLayout.tabCount) {
                    val tab = tabLayout.getTabAt(i)
                    val imageView = tab?.customView?.findViewById<ImageView>(R.id.tabDot)
                    if (i == position) {
                        imageView?.setImageResource(R.drawable.tab_indicator_selected)
                    } else {
                        imageView?.setImageResource(R.drawable.tab_indicator_unselected)
                    }
                }
            }
        })

        handler.postDelayed(autoScrollRunnable, 3000)

        // Productos
        productRecyclerView = findViewById(R.id.productRecyclerView)
        productRecyclerView.layoutManager = GridLayoutManager(this, 2)
        productAdapter = ProductAdapter(allProducts)
        productRecyclerView.adapter = productAdapter

        // Categorías
        categoryIconsLayout = findViewById(R.id.categoryIconsLayout)
        setupStaticCategories()

        // Botón carrito
        val btnCart: ImageView = findViewById(R.id.btnCart)
        btnCart.setOnClickListener {
            startActivity(Intent(this, CartActivity::class.java))
        }

        // Bottom nav
        val bottomNavigation = findViewById<BottomNavigationView>(R.id.bottomNavigation)
        bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> true
                R.id.nav_wishlist -> {
                    startActivity(Intent(this, WishlistActivity::class.java))
                    true
                }
                R.id.nav_tracking -> {
                    startActivity(Intent(this, OrderTrackingActivity::class.java))
                    true
                }
                R.id.nav_cart -> {
                    startActivity(Intent(this, CartActivity::class.java))
                    true
                }
                else -> false
            }
        }
    }

    private fun setupStaticCategories() {
        val categories = listOf(
            "Todos", "Camisetas", "Pantalones", "Vestidos", "Chaquetas",
            "Accesorios", "Bikinis", "Calzados", "Otros"
        )

        val inflater = LayoutInflater.from(this)
        categoryIconsLayout.removeAllViews()

        for (category in categories) {
            val view = inflater.inflate(R.layout.item_category, categoryIconsLayout, false)
            val name = view.findViewById<TextView>(R.id.txtCategoryName)
            val icon = view.findViewById<ImageView>(R.id.imgCategoryIcon)
            name.text = category

            when (category.lowercase()) {
                "camisetas" -> icon.setImageResource(R.drawable.ic_camiseta)
                "pantalones" -> icon.setImageResource(R.drawable.ic_pantalon)
                "vestidos" -> icon.setImageResource(R.drawable.ic_vestido)
                "chaquetas" -> icon.setImageResource(R.drawable.ic_chaqueta)
                "accesorios" -> icon.setImageResource(R.drawable.ic_accesorio)
                "bikinis" -> icon.setImageResource(R.drawable.ic_bikini)
                "calzados" -> icon.setImageResource(R.drawable.ic_calzado)
                else -> icon.setImageResource(R.drawable.ic_default)
            }

            view.setOnClickListener {
                val filtered = if (category == "Todos") {
                    allProducts
                } else {
                    allProducts.filter { it.category.equals(category, ignoreCase = true) }
                }
                productAdapter.updateData(filtered)
            }

            categoryIconsLayout.addView(view)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(autoScrollRunnable)
    }
}
