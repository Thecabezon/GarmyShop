package com.example.garmyshop.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.garmyshop.data.model.CartItem

@Database(
    entities = [CartItem::class],
    version = 2, // <--- incrementa este número (por ejemplo, de 1 a 2)
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun cartDao(): CartDao

    companion object {
        @Volatile private var INSTANCE: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "cart_db"
                )
                    .fallbackToDestructiveMigration() // <--- importante para evitar fallos mientras desarrollas
                    .build()
                    .also { INSTANCE = it }
            }
        }
    }
}
