package com.example.garmyshop

import android.app.Activity
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class AddCardActivity : AppCompatActivity() {

    private lateinit var nameInput: EditText
    private lateinit var cardNumberInput: EditText
    private lateinit var expiryInput: EditText
    private lateinit var cvcInput: EditText
    private lateinit var saveCheckbox: CheckBox
    private lateinit var saveButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_card)

        nameInput = findViewById(R.id.editTextName)
        cardNumberInput = findViewById(R.id.editTextCardNumber)
        expiryInput = findViewById(R.id.editTextExpiry)
        cvcInput = findViewById(R.id.editTextCVC)
        saveCheckbox = findViewById(R.id.checkBoxSaveCard)
        saveButton = findViewById(R.id.buttonSaveCard)

        saveButton.setOnClickListener {
            val name = nameInput.text.toString().trim()
            val number = cardNumberInput.text.toString().trim()
            val expiry = expiryInput.text.toString().trim()
            val cvc = cvcInput.text.toString().trim()

            if (name.isBlank() || number.isBlank() || expiry.isBlank() || cvc.isBlank()) {
                Toast.makeText(this, "Por favor completa todos los campos", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Puedes agregar validaciones reales aquí si deseas

            if (saveCheckbox.isChecked) {
                // Simular almacenamiento en SharedPreferences o ViewModel
                // Aquí podrías guardar la tarjeta de forma simple
                // Por ejemplo: guardar el número (últimos 4 dígitos) o algo similar
            }

            setResult(Activity.RESULT_OK)
            finish()
        }
    }
}
