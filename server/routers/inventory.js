const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory');

router.post('/create', inventoryController.createItem);
router.get('/all', inventoryController.getAllItems);
router.put('/update/:id', inventoryController.updateItemQuantity);
router.delete('/delete/:id', inventoryController.deleteItem);

module.exports = router;
