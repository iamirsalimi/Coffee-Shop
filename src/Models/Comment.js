import mongoose from "mongoose";
import Product from '@/src/Models/Product'

const commentSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    username : {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 40,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    commentText: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 500,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Comment || mongoose.model("Comment", commentSchema)