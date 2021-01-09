const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyUserAccess } = require("../middlewares/auth");
const { verifyToken, verifyTokenOptional } = require("../modules/token");

// get a profile
router.get("/:username", verifyTokenOptional, async (req, res, next) => {
    try {
        let username = req.params.username;
        let user = await User.findOne({ username });
        res.status(200).json({ profile : profileInfo(user)});
    } catch (error) {
        next(error);
    }
});

// Update profile
router.put("/:username", verifyToken, async (req, res, next) => {
    try {
        let username = req.params.username;
        let owner = await User.findOne({ username });
        verifyUserAccess(owner.id, req.user.id, res);
        let user = await User.findOneAndUpdate({ username }, req.body.user, { new : true });
        res.status(200).json({ profile : profileInfo(user)});
    } catch (error) {
        next(error);
    }
});

function profileInfo(user) {
    return {
        name : user.name,
        username : user.username,
        image : user.image,
        bio : user.bio
    }
}

module.exports = router;