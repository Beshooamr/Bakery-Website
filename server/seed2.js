const mongoose = require('mongoose');
const Product = require('./models/product');
require('dotenv').config();

const ITEMS = [
  { name:'Classic Burger',       cat:'Burgers',   price:14.99, time:'15 min', description:'Juicy beef patty with caramelized onions & house sauce',         img:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600', quantity: 50 },
  { name:'Carbonara Pasta',      cat:'Pasta',     price:16.99, time:'20 min', description:'Silky egg sauce, crispy pancetta and aged parmesan',             img:'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600', quantity: 40 },
  { name:'Caesar Salad',         cat:'Salads',    price:11.99, time:'10 min', description:'Crisp romaine, house croutons, and classic caesar dressing',     img:'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600', quantity: 30 },
  { name:'Margherita Pizza',     cat:'Pizza',     price:18.99, time:'25 min', description:'San Marzano tomatoes, fresh mozzarella and basil',               img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', quantity: 20 },
  { name:'Ribeye Steak',         cat:'Steaks',    price:34.99, time:'30 min', description:'Prime 12oz ribeye with herb butter and roasted vegetables',      img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', quantity: 15 },
  { name:'Sushi Platter',        cat:'Sushi',     price:24.99, time:'20 min', description:"Chef's selection of fresh nigiri and maki rolls",               img:'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600', quantity: 15 },
  { name:'Chocolate Lava Cake',  cat:'Desserts',  price:8.99,  time:'15 min', description:'Warm molten chocolate cake with vanilla ice cream',             img:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600', quantity: 25 },
  { name:'Fresh Lemonade',       cat:'Beverages', price:4.99,  time:'5 min',  description:'Hand-squeezed lemon with mint and sparkling water',             img:'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=600', quantity: 100 },
  { name:'Tomato Bisque',        cat:'Soups',     price:9.99,  time:'10 min', description:'Slow-roasted tomato soup with cream and fresh herbs',           img:'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600', quantity: 30 },
  { name:'Street Tacos',         cat:'Tacos',     price:12.99, time:'15 min', description:'Three corn tortillas with al pastor, onion, and cilantro',      img:'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600', quantity: 45 },
  { name:'Double Smash Burger',  cat:'Burgers',   price:17.99, time:'15 min', description:'Double smashed patties with American cheese and pickles',       img:'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600', quantity: 35 },
  { name:'Truffle Pasta',        cat:'Pasta',     price:22.99, time:'25 min', description:'Handmade tagliatelle with black truffle and parmesan',          img:'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600', quantity: 20 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.DB);
    await Product.deleteMany({});
    await Product.insertMany(ITEMS);
    console.log("Successfully seeded rich products!");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
