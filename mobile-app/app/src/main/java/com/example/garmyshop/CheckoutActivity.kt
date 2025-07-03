package com.example.garmyshop

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.garmyshop.ui.viewmodel.CartViewModel

class CheckoutActivity : AppCompatActivity() {

    private lateinit var cartViewModel: CartViewModel
    private lateinit var addressEditText: EditText
    private lateinit var paymentMethodGroup: RadioGroup
    private lateinit var totalTextView: TextView
    private lateinit var confirmButton: Button
    private lateinit var recyclerView: RecyclerView

    private var hasSavedCard = false // Simulado
    private var selectedPaymentMethod: String = "Tarjeta"

    companion object {
        const val REQUEST_ADD_CARD = 1001
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_checkout)

        addressEditText = findViewById(R.id.editTextAddress)
        paymentMethodGroup = findViewById(R.id.radioGroupPayment)
        totalTextView = findViewById(R.id.textViewTotal)
        confirmButton = findViewById(R.id.buttonConfirm)
        recyclerView = findViewById(R.id.recyclerViewCheckout)

        cartViewModel = ViewModelProvider(this)[CartViewModel::class.java]

        val adapter = CartAdapter(mutableListOf(),
            onIncrease = {},
            onDecrease = {},
            onDelete = {}
        )

        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = adapter

        cartViewModel.cartItems.observe(this) { items ->
            adapter.updateItems(items)
            val total = items.sumOf { it.price * it.quantity }
            totalTextView.text = "Total: S/ %.2f".format(total)
        }

        paymentMethodGroup.setOnCheckedChangeListener { _, checkedId ->
            selectedPaymentMethod = when (checkedId) {
                R.id.radioCard -> "Tarjeta"
                R.id.radioCash -> "Contraentrega"
                R.id.radioPaypal -> "PayPal"
                R.id.radioApplePay -> "Apple Pay"
                R.id.radioGooglePay -> "Google Pay"
                else -> "Tarjeta"
            }

            if (selectedPaymentMethod == "Tarjeta" && !hasSavedCard) {
                showAddCardPrompt()
            }
        }

        confirmButton.setOnClickListener {
            val address = addressEditText.text.toString()
            if (address.isBlank()) {
                Toast.makeText(this, "Ingrese una dirección", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Aquí simulas el registro de la compra y limpias el carrito
            cartViewModel.cartItems.value?.forEach {
                cartViewModel.deleteItem(it)
            }

            Toast.makeText(this, "Compra confirmada con $selectedPaymentMethod", Toast.LENGTH_LONG).show()
            finish()
        }
    }

    private fun showAddCardPrompt() {
        AlertDialog.Builder(this)
            .setTitle("No tienes una tarjeta registrada")
            .setMessage("¿Deseas agregar una nueva tarjeta?")
            .setPositiveButton("Sí") { _, _ ->
                openAddCardScreen()
            }
            .setNegativeButton("No") { dialog, _ ->
                dialog.dismiss()
                paymentMethodGroup.check(R.id.radioCash)
            }
            .show()
    }

    private fun openAddCardScreen() {
        val intent = Intent(this, AddCardActivity::class.java)
        startActivityForResult(intent, REQUEST_ADD_CARD)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_ADD_CARD && resultCode == RESULT_OK) {
            hasSavedCard = true
            Toast.makeText(this, "Tarjeta registrada exitosamente", Toast.LENGTH_SHORT).show()
        } else {
            paymentMethodGroup.check(R.id.radioCash)
        }
    }
}
