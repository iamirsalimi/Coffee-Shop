const mongoose = require('mongoose')

let schema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orders: {
        type: Array,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    isDelayed: {
        type: Boolean,
        required: true,
        default: false
    },
    minutesDelayed: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true,
})

const model = mongoose.models.Order || mongoose.model('Order', schema)

export default model