require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Razorpay = require("razorpay");


const app = express();

const razorpay = new Razorpay({
  key_id: "rzp_test_SgUwZnzwyyfW0W",
  key_secret: "npKm7g83RWCdH5D5YvdEsrcS"
});




// ✅ MIDDLEWARE
app.use(cors()); // 👈 THIS FIXES YOUR ERROR
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.post("/api/payment/order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "order_rcptid_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
});



// Home route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// Server
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});


