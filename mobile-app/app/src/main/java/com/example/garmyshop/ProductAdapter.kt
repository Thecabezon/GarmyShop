package com.example.garmyshop.adapter

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.garmyshop.ProductDetailActivity
import com.example.garmyshop.R
import com.example.garmyshop.data.model.Product

class ProductAdapter(
    private var productList: List<Product>
) : RecyclerView.Adapter<ProductAdapter.ProductViewHolder>() {

    fun updateData(newList: List<Product>) {
        productList = newList
        notifyDataSetChanged()
    }

    inner class ProductViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val productImage: ImageView = itemView.findViewById(R.id.productImage)
        val productName: TextView = itemView.findViewById(R.id.productName)
        val productPrice: TextView = itemView.findViewById(R.id.productPrice)
        val btnWishlist: ImageButton = itemView.findViewById(R.id.btnWishlist)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_product, parent, false)
        return ProductViewHolder(view)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val context = holder.itemView.context
        val product = productList[position]

        holder.productName.text = product.name
        holder.productPrice.text = "S/ ${product.price}"

        Glide.with(context)
            .load(product.imageUrl ?: R.drawable.placeholder)
            .placeholder(R.drawable.placeholder)
            .into(holder.productImage)

        // Toggle de favoritos local
        holder.btnWishlist.setImageResource(
            if (product.isInWishlist) R.drawable.ic_heart_filled
            else R.drawable.ic_heart_outline
        )

        holder.btnWishlist.setOnClickListener {
            product.isInWishlist = !product.isInWishlist
            notifyItemChanged(position)
        }

        holder.itemView.setOnClickListener {
            val intent = Intent(context, ProductDetailActivity::class.java)
            intent.putExtra("product", product) // Asegúrate que Product sea Parcelable
            context.startActivity(intent)
        }
    }

    override fun getItemCount(): Int = productList.size
}
