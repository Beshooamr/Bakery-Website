const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

router.post("/create", productController.createProduct);
router.get("/get", productController.getAllProducts);
router.get("/get/:id", productController.getProductById);
router.put("/update/:id", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;