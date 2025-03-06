const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// Admins & Moderators can delete posts
router.delete("/posts/:id", authenticate, authorize(["admin", "moderator"]), async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found." });

    await post.destroy();
    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
