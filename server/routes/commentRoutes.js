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
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 8;

        const offset = (page -1) * limit;

        const { count, rows: comments } = await Comment.findAndCountAll({
            where: { postId: req.params.postId},
            limit,
            offset,
            order:[["createdAt", "ASC"]]
        });

        res.json({
            totalComments: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            comments
        });
    } catch (error) {
        res.status(505).json({ error: error.message})
    }
});

module.exports = router;