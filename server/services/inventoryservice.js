const express = require("express");
const app = express();
app.use(express.json());

let inventory = [
  { id: 1, name: "Burger", stock: 10 },
  { id: 2, name: "Fries", stock: 5 }
];

// Get all products
app.get("/products", (req, res) => {
  res.json(inventory);
});

// Check stock
app.get("/products/:id", (req, res) => {
  const product = inventory.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });

  res.json(product);
});

// Reduce stock
app.post("/reduce-stock", (req, res) => {
  const { productId, quantity } = req.body;

  const product = inventory.find(p => p.id == productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (product.stock < quantity) {
    return res.status(400).json({ message: "Not enough stock" });
  }

  product.stock -= quantity;

  res.json({ message: "Stock updated", product });
});

app.listen(3001, () => {
  console.log("Inventory service running on port 3001");
});