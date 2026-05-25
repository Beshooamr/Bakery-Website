const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

let orders = [];

// Create order
app.post("/orders", async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // 1. Check stock from Inventory Service
    const productRes = await axios.get(
      `http://localhost:3001/products/${productId}`
    );

    const product = productRes.data;

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    // 2. Reduce stock
    await axios.post("http://localhost:3001/reduce-stock", {
      productId,
      quantity
    });

    // 3. Create order
    const order = {
      id: orders.length + 1,
      productId,
      quantity,
      status: "CONFIRMED"
    };

    orders.push(order);

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
});

// Get orders
app.get("/orders", (req, res) => {
  res.json(orders);
});

app.listen(3002, () => {
  console.log("Order service running on port 3002");
});