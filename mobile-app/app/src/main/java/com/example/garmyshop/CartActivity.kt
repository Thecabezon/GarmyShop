package com.example.garmyshop

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.garmyshop.databinding.ActivityCartBinding
import com.example.garmyshop.ui.viewmodel.CartViewModel
import com.example.garmyshop.ui.viewmodel.CartViewModelFactory

class CartActivity : AppCompatActivity() {

    private lateinit var binding: ActivityCartBinding
    private lateinit var cartAdapter: CartAdapter

    // ViewModel correctamente inyectado con la fábrica
    private val cartViewModel: CartViewModel by viewModels {
        CartViewModelFactory(application)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCartBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Configuración del RecyclerView
        cartAdapter = CartAdapter(
            mutableListOf(),
            onIncrease = { item -> cartViewModel.increaseQuantity(item) },
            onDecrease = { item -> cartViewModel.decreaseQuantity(item) },
            onDelete = { item -> cartViewModel.removeItem(item) }
        )

        binding.recyclerViewCart.apply {
            layoutManager = LinearLayoutManager(this@CartActivity)
            adapter = cartAdapter
        }

        // Observar LiveData para actualizar la lista automáticamente
        cartViewModel.cartItems.observe(this) { items ->
            cartAdapter.updateItems(items)
        }

    // Ir a Checkout
        binding.buttonCheckout.setOnClickListener {
            val cartItems = cartAdapter.getCurrentItems()
            if (cartItems.isEmpty()) {
                Toast.makeText(this, "Tu carrito está vacío.", Toast.LENGTH_SHORT).show()
            } else {
                val intent = Intent(this, CheckoutActivity::class.java)
                startActivity(intent)
            }
        }



    }
}

