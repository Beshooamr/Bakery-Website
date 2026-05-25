const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');

router.post('/create', orderController.createOrder);
router.get('/customer/:customerId', orderController.getCustomerOrders);
router.get('/all', orderController.getAllOrders);
router.put('/update/:id', orderController.updateOrderStatus);

module.exports = router;
