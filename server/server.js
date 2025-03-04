require('dotenv').config(); // Load environment variables

const express = require('express');
const sequelize = require('./config/database');
const User = require('./models/User');

const app = express();
app.use(express.json());

sequelize.sync({ alter: true }) // Sync models with MySQL
    .then(() => console.log('Database synchronized'))
    .catch(err => console.error('Error:', err));

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password });
        res.status(201).json({ message: 'User created!', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Use PORT from .env or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));