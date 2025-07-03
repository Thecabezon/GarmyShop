package com.example.garmyshop

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.garmyshop.R
import com.example.garmyshop.data.model.Product

class WishlistAdapter(
    private var wishlistProducts: List<Product>
) : RecyclerView.Adapter<WishlistAdapter.WishlistViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): WishlistViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_product_wishlist, parent, false)
        return WishlistViewHolder(view)
    }

    override fun onBindViewHolder(holder: WishlistViewHolder, position: Int) {
        val product = wishlistProducts[position]
        holder.bind(product)
    }

    override fun getItemCount(): Int = wishlistProducts.size

    fun updateData(newList: List<Product>) {
        wishlistProducts = newList
        notifyDataSetChanged()
    }

    class WishlistViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val productImageView: ImageView = itemView.findViewById(R.id.productImageView)
        private val productNameTextView: TextView = itemView.findViewById(R.id.productNameTextView)
        private val productPriceTextView: TextView = itemView.findViewById(R.id.productPriceTextView)

        fun bind(product: Product) {
            Glide.with(itemView.context)
                .load(product.imageUrl)
                .placeholder(R.drawable.placeholder)
                .into(productImageView)

            productNameTextView.text = product.name
            productPriceTextView.text = "S/ ${product.price}"
        }
    }
}
