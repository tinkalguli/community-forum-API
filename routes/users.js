const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { generateJWT, verifyToken } = require("../modules/token");

// register user
router.post("/register", async (req, res, next) => {
  try {
    let user = await User.create(req.body.user);
    let token = await generateJWT(user);
    res.status(201).json({ user : {...userInfo(user), token}});
  } catch (error) {
    next(error);
  }
});

// login user
router.post("/login", async (req, res, next) => {
  try {
    let email = req.body.user.email;
    let password = req.body.user.password;
    let user = await User.findOne({ email });

    if(user.verifyPassword(password)) {
      let token = await generateJWT(user);
      res.status(201).json({ user : {...userInfo(user), token}});
    } else {
      res.status(403).json({ error : { body : [ "Invalid Password" ]}});
    }
  } catch (error) {
    next(error);
  }
});

// get current user
router.get("/current-user", verifyToken, async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id);
    res.status(200).json({ user : userInfo(user)});
  } catch (error) {
    next(error);
  }
});

function userInfo(user) {
  return {
    username : user.username,
    email : user.email
  }
}

module.exports = router;
