const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyUserAccess } = require("../middlewares/auth");
const jwt = require("../modules/token");

// get a profile
router.get("/:username", jwt.verifyTokenOptional, async (req, res, next) => {
    try {
        let username = req.params.username;
        let user = await User.findOne({ username });
        res.status(200).json({ profile : profileInfo(user)});
    } catch (error) {
        next(error);
    }
});

// Update profile
router.put("/:username", jwt.verifyToken, async (req, res, next) => {
    try {
        let username = req.params.username;
        let owner = await User.findOne({ username });
        verifyUserAccess(owner.id, req.user.id, res);
        let user = await User.findOneAndUpdate({ username }, req.body.user, { new : true });
        if (req.body.user.email) {
            let token = await jwt.generateJWT(user);
            res.status(200).json({ profile : {...profileInfo(user), token }});
        } else {
            res.status(200).json({ profile : profileInfo(user)});
        }
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