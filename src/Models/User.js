const mongoose = require('mongoose')


const cartItemSchema = new mongoose.Schema(
  {
    product : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    size : {
      type: String,
      enum: ["SMALL", "MEDIUM", "LARGE"],
      required: true,
    },
    quantity : {
      type: Number,
      min: 1,
      default: 1,
    },
  }
);

const userSchema = mongoose.Schema(
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
    }
)


const model = mongoose.models.User || mongoose.model('User', userSchema)

export default model