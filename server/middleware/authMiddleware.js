const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET_KEY = process.env.JWT_SECRET || "ourlittlesecret";

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from the Authorization header
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the token
    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
      if (err) {
          return res.status(401).json({ error: 'Failed to authenticate token' });
      }
      console.log("Decoded token:", decoded); // Check what the token contains
  
      try {
          const user = await User.findByPk(decoded.userId); // Verify the ID exists in the DB
          if (!user) {
              return res.status(401).json({ error: 'User not found' });
          }
  
          req.user = user;
          next();
      } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
      }
    });
};

module.exports = { authenticate };