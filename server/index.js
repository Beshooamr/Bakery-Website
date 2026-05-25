const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Restaurant server is running");
});

const productRouter = require("./routers/product");
const userRouter = require("./routers/user");
const orderRouter = require("./routers/order");
const reservationRouter = require("./routers/reservation");
const inventoryRouter = require("./routers/inventory");

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reservations", reservationRouter);
app.use("/api/inventory", inventoryRouter);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});