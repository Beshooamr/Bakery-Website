const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    cat: {
        type: String,
        default: 'All'
    },
    img: {
        type: String
    },
    time: {
        type: String,
        default: '15 min'
    },
    // Health badges for bakery products
    healthBadges: {
        plantBased: { type: Boolean, default: false },
        glutenFree: { type: Boolean, default: false },
        refinedSugarFree: { type: Boolean, default: false },
        guiltFree: { type: Boolean, default: false },
        highProtein: { type: Boolean, default: false },
    },
    ingredients: {
        type: [String],
        default: []
    },
    allergens: {
        type: [String],
        default: []
    }
})

module.exports = mongoose.model("Product", ProductSchema)
