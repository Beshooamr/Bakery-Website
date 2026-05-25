const productService = require('../services/productservice');

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).send(product);
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json({
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    return res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(404).send({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productService.updateProduct(id, req.body);
    return res.status(200).send({ message: 'Product updated successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    return res.status(200).send({ message: 'Product deleted successfully' });
   } catch (error) {
     console.log(error.message);
     res.status(500).send({ message: error.message });
   }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
