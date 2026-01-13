const mongoose = require('mongoose');
import Booking from './Booking'
import Comment from './Comment'
import Order from './Order'

export const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    size: {
      type: String,
      enum: ["SMALL", "MEDIUM", "LARGE"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      default: 1,
    },
  }
);

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    cart: {
      items: [cartItemSchema],
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

userSchema.virtual('bookings', {
  ref: "Booking",
  localField: 'username',
  foreignField: 'username'
})

userSchema.virtual('comments', {
  ref: "Comment",
  localField: 'username',
  foreignField: 'username'
})

userSchema.virtual('orders', {
  ref: "Order",
  localField: '_id',
  foreignField: 'userId'
})

const model = mongoose.models.User || mongoose.model('User', userSchema)

export default model