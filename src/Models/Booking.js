import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
      max: 30
    },

    description: {
      type: String,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELED"],
      default: "PENDING"
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema)
