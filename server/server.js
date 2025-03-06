require("dotenv").config();
const express = require("express");
const sequelize = require("./config/database");
const { router: authRoutes, authenticate } = require("./routes/authRoutes");

const app = express();
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/posts", commentRoutes); 

// Protected Test Route (Only accessible with valid JWT)
app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "You are authorized!", user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));