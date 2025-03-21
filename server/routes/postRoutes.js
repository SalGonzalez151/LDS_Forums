const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const Post = require("../models/Post");

const router = express.Router();

router.post("/",authenticate, async (req, res) => { // Add 'authenticate' middleware
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { title, content, categoryId } = req.body;
        console.log('Category ID:', categoryId);

        if (!title || !content || !categoryId) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newPost = await Post.create({
            title,
            content,
            categoryId,
            userId: req.user.id, // This will work if req.user is properly set
        });

        res.status(201).json(newPost); // Return the newly created post
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        let { page, limit, search } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        const offset = (page - 1) * limit;

        let whereCondition = {};
        if (search) {
            whereCondition = {
                [Op.or]: [
                  { title: {[Op.like]: `%${search}%`}},
                  { content: {[Op.like]: `%${search}%`}},
                ]
            };
        }

        const { count, rows: posts } = await Post.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [["createdAt", "DESC"]]
        });

        res.json({
            totalPosts: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            posts,
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const post = Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({error: "No post found!"});

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
})

router.delete("/:id", authenticate, async (req, res) => {
    try {
        const post = Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({error: "Post not found"});

        if (post.userId !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({ error: "Not Authorized!"})
        }

        await post.destroy()
        res.json({message: "Post deleted"});
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
})

router.put("/:id", authenticate, async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found." });
  
      // Only allow admin, moderator, or the post's owner to update
      if (req.user.role !== "admin" && req.user.role !== "moderator" && req.user.id !== post.userId) {
        return res.status(403).json({ error: "Permission denied." });
      }
  
      await post.update(req.body);
      res.json({ message: "Post updated successfully.", post });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;