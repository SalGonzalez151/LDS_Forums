const express = require("express");
const { authenticate } = require("./authRoutes");
const Comment = require("../models/Comment");

const router = express.Router();

router.post("/:postId/comments", authenticate, async (req, res) => {
    try {
        const comment = await Comment.create({
            content: req.body.content,
            userId: req.user.userId,
            postId: req.params.postId,
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
});

router.get("/:postId/comments", async (req, res)=> {
    try {
        const comments = Comment.findAll({ where: { postId: req.params.postId}});

        res.json(comments);
    } catch (error) {
        res.status(505).json({ error: error.message})
    }
});

module.exports = router;