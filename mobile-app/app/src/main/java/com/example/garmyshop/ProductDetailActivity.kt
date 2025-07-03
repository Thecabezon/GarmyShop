package com.example.garmyshop

import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.garmyshop.data.model.CartItem
import com.example.garmyshop.data.model.Product
import com.example.garmyshop.data.model.Review
import com.example.garmyshop.ui.viewmodel.CartViewModel
import com.example.garmyshop.ui.viewmodel.CartViewModelFactory

class ProductDetailActivity : AppCompatActivity() {

    private lateinit var imageView: ImageView
    private lateinit var nameTextView: TextView
    private lateinit var priceTextView: TextView
    private lateinit var addToCartButton: Button

    private lateinit var sizeButtons: List<Button>
    private var selectedSize: String? = null

    private lateinit var colorViews: List<View>
    private var selectedColor: Int? = null

    private lateinit var cartViewModel: CartViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_product_detail)

        // Vistas
        imageView = findViewById(R.id.productImageView)
        nameTextView = findViewById(R.id.productNameTextView)
        priceTextView = findViewById(R.id.productPriceTextView)
        addToCartButton = findViewById(R.id.addToCartButton)

        // Inicializar ViewModel
        cartViewModel = ViewModelProvider(this, CartViewModelFactory(application))[CartViewModel::class.java]

        // Recibir producto desde MainActivity
        val product = intent.getParcelableExtra<Product>("product")
        if (product != null) {
            nameTextView.text = product.name
            priceTextView.text = "S/ ${product.price}"
            Glide.with(this)
                .load(product.imageUrl ?: R.drawable.placeholder)
                .into(imageView)
        }

        // Tallas
        sizeButtons = listOf(
            findViewById(R.id.sizeS),
            findViewById(R.id.sizeM),
            findViewById(R.id.sizeL),
            findViewById(R.id.sizeXL)
        )

        sizeButtons.forEach { button ->
            button.setOnClickListener {
                selectedSize = button.text.toString()
                updateSizeSelection(button)
            }
        }

        // Colores
        val container = findViewById<LinearLayout>(R.id.colorContainer)
        colorViews = (0 until container.childCount).map { container.getChildAt(it) }

        colorViews.forEach { view ->
            view.setOnClickListener {
                selectedColor = view.backgroundTintList?.defaultColor ?: Color.TRANSPARENT
                updateColorSelection(view)
            }
        }

        // Agregar al carrito
        addToCartButton.setOnClickListener {
            if (product == null) {
                Toast.makeText(this, "Producto inválido", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            if (selectedSize == null || selectedColor == null) {
                Toast.makeText(this, "Seleccione talla y color", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val cartItem = CartItem(
                id = 0,
                productId = product.name.hashCode(), // Generamos un ID local ficticio
                name = product.name,
                image_url = product.imageUrl ?: "",
                price = product.price,
                quantity = 1,
                size = selectedSize ?: "",
                color = selectedColor ?: Color.TRANSPARENT
            )

            cartViewModel.insertItem(cartItem)
            Toast.makeText(this, "Producto agregado al carrito", Toast.LENGTH_SHORT).show()
        }

// 1. Crea lista local de reseñas
        val dummyReviews = mutableListOf(
            Review("Ana", "Muy buen producto, llegó a tiempo.", 5),
            Review("Carlos", "Calidad aceptable, talla justa.", 4)
        )

        val reviewAdapter = ReviewAdapter(dummyReviews)

        val reviewsRecyclerView = findViewById<RecyclerView>(R.id.reviewsRecyclerView)
        reviewsRecyclerView.layoutManager = LinearLayoutManager(this)
        reviewsRecyclerView.adapter = reviewAdapter

        val ratingBar = findViewById<RatingBar>(R.id.ratingBar)
        val reviewEditText = findViewById<EditText>(R.id.editTextReview)
        val buttonSubmitReview = findViewById<Button>(R.id.buttonSubmitReview)
        val buttonCancelReview = findViewById<Button>(R.id.buttonCancelReview)

// 2. Enviar reseña simulada
        buttonSubmitReview.setOnClickListener {
            val rating = ratingBar.rating.toInt()
            val comment = reviewEditText.text.toString().trim()

            if (rating == 0 || comment.isEmpty()) {
                Toast.makeText(this, "Ingrese calificación y comentario", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val newReview = Review("Sandra Anchelia", comment, rating)
            reviewAdapter.addReview(newReview)

            Toast.makeText(this, "¡Gracias por tu reseña!", Toast.LENGTH_SHORT).show()
            ratingBar.rating = 0f
            reviewEditText.text.clear()
        }

        // 3. Cancelar reseña
        buttonCancelReview.setOnClickListener {
            ratingBar.rating = 0f
            reviewEditText.text.clear()
            Toast.makeText(this, "Reseña cancelada", Toast.LENGTH_SHORT).show()
        }
    }

    private fun updateSizeSelection(selected: Button) {
        sizeButtons.forEach {
            it.setBackgroundColor(Color.LTGRAY)
            it.setTextColor(Color.BLACK)
        }
        selected.setBackgroundColor(Color.DKGRAY)
        selected.setTextColor(Color.WHITE)
    }

    private fun updateColorSelection(selected: View) {
        colorViews.forEach { it.alpha = 0.5f }
        selected.alpha = 1.0f
    }
}
