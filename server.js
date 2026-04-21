require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ MIDDLEWARE
app.use(cors()); // 👈 THIS FIXES YOUR ERROR
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

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


