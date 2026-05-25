require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

const products = [
    {
        name: "Brownie balls(3pcs)",
        description: "Delicious chocolate brownie balls packed with rich cocoa flavor",
        price: 100,
        quantity: 50,
        cat: "Pastries",
        img: "brownie-balls.jpg",
        time: "10 min",
        healthBadges: {
            plantBased: false,
            glutenFree: false,
            refinedSugarFree: false,
            guiltFree: false,
            highProtein: false
        },
        ingredients: ["Chocolate", "Flour", "Sugar", "Eggs", "Butter"],
        allergens: ["Gluten", "Eggs", "Dairy"]
    },
    {
        name: "Cupcake sweet",
        description: "Sweet vanilla cupcake with creamy frosting",
        price: 90,
        quantity: 40,
        cat: "Cupcakes",
        img: "cupcake-sweet.jpg",
        time: "15 min",
        healthBadges: {
            plantBased: false,
            glutenFree: false,
            refinedSugarFree: false,
            guiltFree: false,
            highProtein: false
        },
        ingredients: ["Flour", "Sugar", "Vanilla", "Eggs", "Butter"],
        allergens: ["Gluten", "Eggs", "Dairy"]
    },
    {
        name: "Cupcake salty",
        description: "Savory salty cupcake with herb frosting",
        price: 95,
        quantity: 35,
        cat: "Cupcakes",
        img: "cupcake-salty.jpg",
        time: "15 min",
        healthBadges: {
            plantBased: false,
            glutenFree: false,
            refinedSugarFree: false,
            guiltFree: false,
            highProtein: false
        },
        ingredients: ["Flour", "Herbs", "Cheese", "Eggs", "Butter"],
        allergens: ["Gluten", "Eggs", "Dairy"]
    },
    {
        name: "Cookies(4pcs)",
        description: "Fresh baked cookies with perfect crispy exterior",
        price: 75,
        quantity: 60,
        cat: "Cookies",
        img: "cookies.jpg",
        time: "8 min",
        healthBadges: {
            plantBased: false,
            glutenFree: false,
            refinedSugarFree: false,
            guiltFree: false,
            highProtein: false
        },
        ingredients: ["Flour", "Sugar", "Butter", "Eggs", "Vanilla"],
        allergens: ["Gluten", "Eggs", "Dairy"]
    }
];

async function addProducts() {
    try {
        await mongoose.connect(process.env.DB);
        console.log('Connected to MongoDB');

        for (const product of products) {
            const existing = await Product.findOne({ name: product.name });
            if (!existing) {
                const newProduct = await Product.create(product);
                console.log(`✓ Added: ${newProduct.name}`);
            } else {
                console.log(`✓ Already exists: ${product.name}`);
            }
        }

        console.log('\nAll products processed!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

addProducts();
