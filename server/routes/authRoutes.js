const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

// 🔹 Register User
router.post("/register", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });

    res.status(201).json({ message: "User created!", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Protect Routes Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { router, authenticate };