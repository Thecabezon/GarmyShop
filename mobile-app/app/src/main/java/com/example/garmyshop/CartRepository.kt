package com.example.garmyshop

import com.example.garmyshop.data.local.CartDao
import com.example.garmyshop.data.model.CartItem
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class CartRepository(private val dao: CartDao) {

    fun getAllItems() = dao.getAllItems()

    suspend fun insertItem(item: CartItem) = withContext(Dispatchers.IO) {
        dao.insertItem(item)
    }

    suspend fun updateItem(item: CartItem) = withContext(Dispatchers.IO) {
        dao.updateItem(item)
    }

    suspend fun deleteItem(item: CartItem) = withContext(Dispatchers.IO) {
        dao.deleteItem(item)
    }
}