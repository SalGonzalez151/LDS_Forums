const express = require("express");
const { authenticate } = require("./authRoutes");
const Post = require("../models/Post");

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
    try {
        const post = await Post.create({...req.body, userId: req.user.userId});
        res.status(201).json(post);
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

router.put('/:id', authenticate, async (req, res) => {
    try {
        const post = Post.findByPk(req.params.id);
        if (!post) return res.status(404).json("Post not found");

        if (post.userId !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({ error: "Not Authorized!"});
        }

        await post.update(req.body);
        res.json({ message: "Post Updated", post});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

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

module.exports = router;