require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

const updatedProducts = [
    {
        oldName: "Brownie balls(3pcs)",
        newData: {
            name: "Brownie Balls",
            description: "Delicious chocolate brownie balls packed with rich cocoa flavor",
            price: 100,
            quantity: 50,
            cat: "Pastries"
        }
    },
    {
        oldName: "Cupcake sweet",
        newData: {
            name: "Oatmeal Apple Cupcakes",
            description: "Healthy oatmeal apple cupcakes with natural sweetness",
            price: 90,
            quantity: 40,
            cat: "Cupcakes"
        }
    },
    {
        oldName: "Cupcake salty",
        newData: {
            name: "Salty Cupcakes",
            description: "Savory salty cupcake with herb frosting",
            price: 95,
            quantity: 35,
            cat: "Cupcakes"
        }
    },
    {
        oldName: "Cookies(4pcs)",
        newData: {
            name: "Chocolate Cookies",
            description: "Fresh baked chocolate cookies with perfect crispy exterior",
            price: 75,
            quantity: 60,
            cat: "Cookies"
        }
    }
];

async function updateProducts() {
    try {
        await mongoose.connect(process.env.DB);
        console.log('Connected to MongoDB');

        for (const item of updatedProducts) {
            const result = await Product.findOneAndUpdate(
                { name: item.oldName },
                item.newData,
                { new: true }
            );
            if (result) {
                console.log(`✓ Updated: ${item.oldName} → ${item.newData.name}`);
            } else {
                console.log(`✗ Not found: ${item.oldName}`);
            }
        }

        console.log('\nAll products updated!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

updateProducts();
