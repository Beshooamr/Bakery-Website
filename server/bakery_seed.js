const mongoose = require('mongoose');
const Product = require('./models/product');
require('dotenv').config();

const BAKERY_ITEMS = [
    {
        name: 'Brownie Balls',
        cat: 'Brownies',
        price: 100,
        time: '10 min',
        description: 'Rich, fudgy brownie balls packed with dark chocolate chips. Perfect indulgence for chocolate lovers.',
        img: '/images/brownie-balls.jpg',
        quantity: 50,
        healthBadges: {
            plantBased: false,
            glutenFree: false,
            refinedSugarFree: true,
            guiltFree: true,
            highProtein: false,
        },
        ingredients: ['Dark Chocolate', 'Whole Wheat Flour', 'Eggs', 'Honey', 'Almond Butter', 'Vanilla'],
        allergens: ['Wheat', 'Eggs', 'Tree Nuts']
    },
    {
        name: 'Chocolate Cookies',
        cat: 'Cookies',
        price: 75,
        time: '10 min',
        description: 'Crispy yet chewy chocolate cookies made with whole grain flour and natural sweeteners.',
        img: '/images/chocolate-cookies.jpg',
        quantity: 60,
        healthBadges: {
            plantBased: true,
            glutenFree: false,
            refinedSugarFree: true,
            guiltFree: true,
            highProtein: false,
        },
        ingredients: ['Whole Wheat Flour', 'Dark Chocolate', 'Coconut Oil', 'Maple Syrup', 'Vanilla Extract', 'Baking Soda'],
        allergens: ['Wheat']
    },
    {
        name: 'Salty Cupcakes',
        cat: 'Cupcakes',
        price: 95,
        time: '15 min',
        description: 'Savory cupcakes with a perfect balance of salt and sweetness. A unique treat for adventurous palates.',
        img: '/images/salty-cupcakes.jpg',
        quantity: 40,
        healthBadges: {
            plantBased: false,
            glutenFree: false,
            refinedSugarFree: true,
            guiltFree: true,
            highProtein: true,
        },
        ingredients: ['Almond Flour', 'Eggs', 'Honey', 'Sea Salt', 'Butter', 'Lemon Zest'],
        allergens: ['Eggs', 'Tree Nuts']
    },
    {
        name: 'Oatmeal Apple Cupcakes',
        cat: 'Cupcakes',
        price: 90,
        time: '15 min',
        description: 'Wholesome cupcakes with fresh apples and hearty oatmeal. Naturally sweetened for guilt-free enjoyment.',
        img: '/images/oatmeal-apple-cupcakes.jpg',
        quantity: 45,
        healthBadges: {
            plantBased: true,
            glutenFree: false,
            refinedSugarFree: true,
            guiltFree: true,
            highProtein: false,
        },
        ingredients: ['Rolled Oats', 'Apples', 'Whole Wheat Flour', 'Coconut Oil', 'Honey', 'Cinnamon', 'Vanilla Extract'],
        allergens: ['Wheat']
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.DB);
        await Product.deleteMany({});
        await Product.insertMany(BAKERY_ITEMS);
        console.log("Successfully seeded Crave Better bakery products!");
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
}

seed();
