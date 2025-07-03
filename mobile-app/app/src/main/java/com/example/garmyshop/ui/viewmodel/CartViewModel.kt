package com.example.garmyshop.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.viewModelScope
import com.example.garmyshop.data.local.AppDatabase
import com.example.garmyshop.data.model.CartItem
import com.example.garmyshop.CartRepository
import kotlinx.coroutines.launch

class CartViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: CartRepository
    val cartItems: LiveData<List<CartItem>>

    init {
        val dao = AppDatabase.getInstance(application).cartDao()
        repository = CartRepository(dao)
        cartItems = repository.getAllItems()
    }

    fun insertItem(item: CartItem) = viewModelScope.launch {
        repository.insertItem(item)
    }

    fun updateItem(item: CartItem) = viewModelScope.launch {
        repository.updateItem(item)
    }

    fun deleteItem(item: CartItem) = viewModelScope.launch {
        repository.deleteItem(item)
    }

    fun increaseQuantity(item: CartItem) {
        val updatedItem = item.copy(quantity = item.quantity + 1)
        updateItem(updatedItem)
    }

    fun decreaseQuantity(item: CartItem) {
        if (item.quantity > 1) {
            val updatedItem = item.copy(quantity = item.quantity - 1)
            updateItem(updatedItem)
        } else {
            deleteItem(item)
        }
    }

    fun removeItem(item: CartItem) {
        deleteItem(item)
    }
}
