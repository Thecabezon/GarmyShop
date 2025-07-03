package com.example.garmyshop

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.RatingBar
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.garmyshop.data.model.Review

class ReviewAdapter(private val reviews: MutableList<Review>) :
    RecyclerView.Adapter<ReviewAdapter.ReviewViewHolder>() {

    class ReviewViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val userText: TextView = view.findViewById(R.id.reviewUser)
        val commentText: TextView = view.findViewById(R.id.reviewComment)
        val ratingBar: RatingBar = view.findViewById(R.id.reviewRating)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ReviewViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_review, parent, false)
        return ReviewViewHolder(view)
    }

    override fun onBindViewHolder(holder: ReviewViewHolder, position: Int) {
        val review = reviews[position]
        holder.userText.text = review.user
        holder.commentText.text = review.comment
        holder.ratingBar.rating = review.rating.toFloat()
    }

    override fun getItemCount(): Int = reviews.size

    fun addReview(review: Review) {
        reviews.add(0, review) // Añadir al inicio
        notifyItemInserted(0)
    }
}
