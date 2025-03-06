const express = require("express");
const User = require("../models/User");
const { authenticate } = require("./authRoutes");

const router = express.Router();

router.get("/:id", authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {attributes: [ "id", "username", "email", "role"]});
        if (!user) return res.status(404).json({error: "User not found"});

        res.json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

module.exports = router;