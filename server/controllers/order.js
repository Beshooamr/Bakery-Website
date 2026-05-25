const Order = require('../models/order');
const Product = require('../models/product');

const createOrder = async (req, res) => {
  try {
    const { customer, items, totalPrice, deliveryAddress, specialInstructions, paymentMethod, fulfillmentType, deliveryFee, tax } = req.body;

    if (!customer || !items || items.length === 0 || !totalPrice) {
      return res.status(400).json({ message: 'Customer, items, and totalPrice are required' });
    }

    // Check availability first
    for (const item of items) {
      const product = item.product
        ? await Product.findById(item.product)
        : await Product.findOne({ name: item.name });
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${item.name}. Available: ${product.quantity}` });
      }
    }

    // Deduct quantities
    for (const item of items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, { $inc: { quantity: -item.quantity } });
      } else {
        await Product.findOneAndUpdate({ name: item.name }, { $inc: { quantity: -item.quantity } });
      }
    }

    const newOrder = await Order.create({
      customer,
      items,
      totalPrice,
      deliveryAddress,
      specialInstructions,
      paymentMethod,
      fulfillmentType: fulfillmentType || 'pickup',
      deliveryFee: deliveryFee || 0,
      tax: tax || 0
    });

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await Order.find({ customer: customerId });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    // Optionally filter by status (e.g., ?status=pending)
    const filter = req.query.status ? { status: req.query.status } : {};
    const orders = await Order.find(filter).populate('customer', 'name email phone');
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getAllOrders,
  updateOrderStatus
};
