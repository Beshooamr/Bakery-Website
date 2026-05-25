const Product = require('../models/product');

const createProduct = async (productData) => {
  const { name, description, price, quantity, cat, img, time, healthBadges, ingredients, allergens } = productData;

  if (!name || !description || price === undefined || quantity === undefined) {
    throw new Error('Send all required fields: name, description, price, quantity');
  }

  const newProduct = {
    name,
    description,
    price,
    quantity,
    cat: cat || 'All',
    img: img || '',
    time: time || '15 min',
    healthBadges: healthBadges || {
      plantBased: false,
      glutenFree: false,
      refinedSugarFree: false,
      guiltFree: false,
      highProtein: false
    },
    ingredients: ingredients || [],
    allergens: allergens || []
  };
  return await Product.create(newProduct);
};

const getAllProducts = async () => {
  return await Product.find({});
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');
  return product;
};

const updateProduct = async (id, productData) => {
  const { name, description, price, quantity } = productData;

  if (!name || !description || price === undefined || quantity === undefined) {
    throw new Error('Send all required fields: name, description, price, quantity');
  }

  const result = await Product.findByIdAndUpdate(id, productData, { new: true });
  if (!result) throw new Error('Product not found');
  return result;
};

const deleteProduct = async (id) => {
  const result = await Product.findByIdAndDelete(id);
  if (!result) throw new Error('Product not found');
  return result;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
