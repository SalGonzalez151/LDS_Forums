const express = require('express');
const router = express.Router();

// Mock category data (replace with DB call)
const categories = [
  { id: '1', name: 'General' },
  { id: '2', name: 'Announcements' },
  { id: '3', name: 'Questions' },
  { id: '4', name: 'Feedback' },
  { id: '5', name: 'Games'},
];

// Get all categories
router.get('/categories', (req, res) => {
  res.json(categories);
});

module.exports = router;