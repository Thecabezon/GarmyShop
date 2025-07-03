package com.example.garmyshop.data.local

import androidx.lifecycle.LiveData
import androidx.room.*
import com.example.garmyshop.data.model.CartItem

@Dao
interface CartDao {

    @Query("SELECT * FROM cart_items")
    fun getAllItems(): LiveData<List<CartItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insertItem(item: CartItem)

    @Update
    fun updateItem(item: CartItem)

    @Delete
    fun deleteItem(item: CartItem)

    @Query("DELETE FROM cart_items")
    fun clearCart()

}
