package com.example.garmyshop.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Product(
    val name: String,
    val price: Double,
    val category: String,
    val imageUrl: String? = null,
    var isInWishlist: Boolean = false
) : Parcelable
