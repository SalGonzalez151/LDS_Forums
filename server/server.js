require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const categoryRoutes = require('./routes/categoryRoutes')
const authenticate = require('./middleware/authMiddleware')
const sequelize = require("./config/database");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/posts", commentRoutes); 
app.use("/categories", categoryRoutes);

sequelize.sync({ alter: true })  
  .then(() => {
    console.log("Database connected and synced!");
  })
  .catch((error) => {
    console.error("Error connecting to the database: ", error);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));