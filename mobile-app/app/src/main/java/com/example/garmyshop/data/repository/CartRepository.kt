package com.example.garmyshop.data.repository

import com.example.garmyshop.data.local.CartDao
import com.example.garmyshop.data.model.CartItem

class CartRepository(private val dao: CartDao) {
    suspend fun getCartItems() = dao.getAllItems()
    suspend fun insertItem(item: CartItem) = dao.insertItem(item)
    suspend fun updateItem(item: CartItem) = dao.updateItem(item)
    suspend fun deleteItem(item: CartItem) = dao.deleteItem(item)
    suspend fun clearCart() = dao.clearCart()
}
