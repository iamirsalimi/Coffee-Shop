import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
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
      max: 20,
    },

    description: {
      type: String,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING"
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema)
