const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const Post = require("../models/Post");

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
    try {
        let { page, limit, search } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10

        const offset = (page-1) * limit;

        const { count, rows: posts } = await Post.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [["createdAt", "DESC"]]
        });

        let whereCondition = {};
        if (search) {
            whereCondition = {
                [Op.or]: [
                  { title: {[Op.like]: `%${search}%`}},
                  { content: {[Op.like]: `%${search}%`}},
                ]
            };
        }

        res.json({
            totalPosts: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            posts,
        })
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get("/", async (req, res)=> {
    try {
        const posts = Post.findAll();
        res.json(posts);
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