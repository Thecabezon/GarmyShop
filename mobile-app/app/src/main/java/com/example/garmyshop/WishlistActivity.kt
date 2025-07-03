package com.example.garmyshop

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.garmyshop.adapter.ProductAdapter
import com.example.garmyshop.data.model.Product
import com.example.garmyshop.LocalProductRepository

class WishlistActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: ProductAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_wishlist)

        recyclerView = findViewById(R.id.wishlistRecyclerView)
        recyclerView.layoutManager = GridLayoutManager(this, 2)

        // Obtener todos los productos y filtrar los favoritos
        val allProducts = LocalProductRepository.getProducts()
        val wishlist = allProducts.filter { it.isInWishlist }

        adapter = ProductAdapter(wishlist)
        recyclerView.adapter = adapter

        if (wishlist.isEmpty()) {
            Toast.makeText(this, "Tu lista de favoritos está vacía", Toast.LENGTH_SHORT).show()
        }
    }
}
