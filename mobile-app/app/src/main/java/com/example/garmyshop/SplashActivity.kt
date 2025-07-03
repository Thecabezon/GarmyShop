package com.example.garmyshop
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity

class SplashActivity : AppCompatActivity() {

    private val splashDelay: Long = 3000 // 3 segundos

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash) // tu layout splash

        Handler(Looper.getMainLooper()).postDelayed({
            // Abrir LoginActivity después del delay
            startActivity(Intent(this, LoginActivity::class.java))
            finish() // para que no puedas volver a la splash con "back"
        }, splashDelay)
    }
}
