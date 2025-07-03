package com.example.garmyshop

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class RegisterActivity : AppCompatActivity() {

    private lateinit var etNombre: EditText
    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var checkboxTerms: CheckBox
    private lateinit var btnRegistrar: Button
    private lateinit var linkTerms: TextView
    private lateinit var linkLogin: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        etNombre = findViewById(R.id.etNombre)
        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        checkboxTerms = findViewById(R.id.checkboxTerms)
        btnRegistrar = findViewById(R.id.btnRegistrar)
        linkTerms = findViewById(R.id.linkTerms)
        linkLogin = findViewById(R.id.linkLogin)

        btnRegistrar.setOnClickListener {
            val nombre = etNombre.text.toString().trim()
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            when {
                nombre.isEmpty() || email.isEmpty() || password.isEmpty() -> {
                    Toast.makeText(this, "Complete todos los campos", Toast.LENGTH_SHORT).show()
                }
                !checkboxTerms.isChecked -> {
                    Toast.makeText(this, "Debe aceptar los Términos y Condiciones", Toast.LENGTH_SHORT).show()
                }
                else -> {
                    Toast.makeText(this, "Registro exitoso", Toast.LENGTH_SHORT).show()
                    val intent = Intent(this, LoginActivity::class.java)
                    startActivity(intent)
                    finish()
                }
            }
        }

        linkTerms.setOnClickListener {
            startActivity(Intent(this, TermsActivity::class.java))
        }

        linkLogin.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }
}
