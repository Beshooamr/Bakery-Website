require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

async function fixImagePath() {
    try {
        await mongoose.connect(process.env.DB);
        console.log('Connected to MongoDB');

        const result = await Product.findOneAndUpdate(
            { name: "Brownie Balls" },
            { img: "/images/brownie-balls.jpg" },
            { new: true }
        );

        if (result) {
            console.log(`✓ Updated: Brownie Balls image path to ${result.img}`);
        } else {
            console.log(`✗ Product not found`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

fixImagePath();
