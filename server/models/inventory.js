const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  unit: {
    type: String, // e.g., 'kg', 'liters', 'pieces'
    required: true,
  },
  lowStockThreshold: {
    type: Number,
    required: true,
    default: 10,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);
