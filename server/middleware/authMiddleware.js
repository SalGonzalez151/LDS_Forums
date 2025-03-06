const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify authentication
const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id); // Attach user to request

    if (!req.user) return res.status(401).json({ error: "User not found." });

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

// Middleware to check roles
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Access forbidden: insufficient permissions." });
  }
  next();
};

module.exports = { authenticate, authorize };
