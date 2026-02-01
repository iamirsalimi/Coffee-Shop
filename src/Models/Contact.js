import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 1000,
    },

    isRead: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
})

export default mongoose.models.Contact || mongoose.model("Contact", contactSchema)
