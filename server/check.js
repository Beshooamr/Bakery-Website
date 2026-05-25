const mongoose = require('mongoose');
const Product = require('./models/product');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/tastebite");
  const p = await Product.find({});
  console.log(p.map(x => ({name: x.name, img: x.img})));
  process.exit(0);
}
check();
