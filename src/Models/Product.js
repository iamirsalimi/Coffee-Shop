const mongoose = require('mongoose')
import Comment from '@/src/Models/Comment'

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    smallPrice: {
        type: Number,
        required: true
    },
    mediumPrice: {
        type: Number,
        required: true
    },
    largePrice: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ["HOT", "COLD", "SPECIAL"],
        required: true
    },
    image: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        default: [],
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    isAvailable: {
        type: Boolean,
        default: true,
        required: true
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

productSchema.virtual('comments', {
    ref: 'Comment',
    localField: "_id",
    foreignField: "productId"
})

const model = mongoose.models.Product || mongoose.model('Product', productSchema)

export default model
