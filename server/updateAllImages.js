require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

const updates = [
    {
        name: "Oatmeal Apple Cupcakes",
        img: "/images/oatmeal-apple-cupcakes.jpg"
    },
    {
        name: "Salty Cupcakes",
        img: "/images/salty-cupcakes.jpg"
    },
    {
        name: "Chocolate Cookies",
        img: "/images/chocolate-cookies.jpg"
    }
];

async function updateProductImages() {
    try {
        await mongoose.connect(process.env.DB);
        console.log('Connected to MongoDB');

        for (const update of updates) {
            const result = await Product.findOneAndUpdate(
                { name: update.name },
                { img: update.img },
                { new: true }
            );
            if (result) {
                console.log(`✓ Updated: ${update.name} → ${update.img}`);
            } else {
                console.log(`✗ Not found: ${update.name}`);
            }
        }

        console.log('\nAll images updated!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

updateProductImages();
