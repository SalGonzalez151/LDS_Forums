const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

// 🔹 Register User
router.post("/register", async (req, res) => {  
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });

    res.status(201).json({ message: "User created!", user });
  } catch (error) {
    console.error(error); // Add more detailed logging here
    res.status(500).json({ error: error.message });
  }

});

// 🔹 Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login Attempt:", email, password); // ✅ Check what's coming from frontend

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("User not found!"); // ✅ Debugging log
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("User found:", user.username); // ✅ Debugging log

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch); // ✅ Debugging log

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    console.log("Generated Token:", token); // ✅ Debugging log

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;