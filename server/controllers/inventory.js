const Inventory = require('../models/inventory');

const createItem = async (req, res) => {
  try {
    const { itemName, quantity, unit, lowStockThreshold, supplier } = req.body;
    
    if (!itemName || quantity === undefined || !unit) {
      return res.status(400).json({ message: 'Item name, quantity, and unit are required' });
    }

    const newItem = await Inventory.create({
      itemName,
      quantity,
      unit,
      lowStockThreshold,
      supplier
    });

    res.status(201).json({ message: 'Inventory item created successfully', item: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find({}).populate('supplier', 'name email phone');
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ message: 'Quantity is required' });
    }

    const item = await Inventory.findByIdAndUpdate(id, { quantity }, { new: true });
    
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.status(200).json({ message: 'Inventory quantity updated', item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Inventory.findByIdAndDelete(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createItem,
  getAllItems,
  updateItemQuantity,
  deleteItem
};
