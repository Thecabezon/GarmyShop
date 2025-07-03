package com.example.garmyshop

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.garmyshop.data.model.CartItem

class CartAdapter(
    private var items: MutableList<CartItem>,
    private val onIncrease: (CartItem) -> Unit,
    private val onDecrease: (CartItem) -> Unit,
    private val onDelete: (CartItem) -> Unit
) : RecyclerView.Adapter<CartAdapter.CartViewHolder>() {

    inner class CartViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val productImage: ImageView = itemView.findViewById(R.id.productImage)
        val productName: TextView = itemView.findViewById(R.id.productName)
        val productPrice: TextView = itemView.findViewById(R.id.productPrice)
        val quantityTextView: TextView = itemView.findViewById(R.id.quantityTextView)
        val increaseButton: Button = itemView.findViewById(R.id.increaseQuantityButton)
        val decreaseButton: Button = itemView.findViewById(R.id.decreaseQuantityButton)
        val deleteButton: ImageView = itemView.findViewById(R.id.deleteButton)
//        val sizeTextView: TextView = itemView.findViewById(R.id.sizeTextView)
//        val colorView: View = itemView.findViewById(R.id.colorView)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CartViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_cart_product, parent, false)
        return CartViewHolder(view)
    }

    override fun onBindViewHolder(holder: CartViewHolder, position: Int) {
        val item = items[position]

        Glide.with(holder.itemView.context)
            .load(item.image_url)
            .placeholder(R.drawable.placeholder)
            .into(holder.productImage)

        holder.productName.text = item.name
        holder.productPrice.text = "S/ %.2f".format(item.price)
        holder.quantityTextView.text = item.quantity.toString()

//        holder.sizeTextView.text = "Talla: ${item.size}"
//        holder.colorView.setBackgroundColor(item.color)

        holder.increaseButton.setOnClickListener { onIncrease(item) }
        holder.decreaseButton.setOnClickListener { onDecrease(item) }
        holder.deleteButton.setOnClickListener { onDelete(item) }
    }

    override fun getItemCount(): Int = items.size

    fun updateItems(newItems: List<CartItem>) {
        items.clear()
        items.addAll(newItems)
        notifyDataSetChanged()
    }

    fun getCurrentItems(): List<CartItem> = items
}
