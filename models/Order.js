const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET || "secretkey123");
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// Middleware to verify admin
function verifyAdmin(req, res, next) {
  if (!req.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only!" });
  }
  next();
}

// SAVE ORDER
router.post("/", verifyToken, async (req, res) => {
  try {
    const { userName, userEmail, items, totalAmount, paymentMethod, paymentId, address } = req.body;

    const order = new Order({
      userId: req.userId,
      userName,
      userEmail,
      items,
      totalAmount,
      paymentMethod,
      paymentId,
      address,
      status: "Pending"
    });

    await order.save();
    res.json({ message: "Order saved successfully", order });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET USER ORDERS
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL ORDERS (Admin only)
router.get("/all", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE ORDER STATUS (Admin only)
router.put("/:id/status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL USERS (Admin only)
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const User = require("../models/User");
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;