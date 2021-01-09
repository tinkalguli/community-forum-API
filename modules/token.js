const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.generateJWT = async (user) => {
    let payload = { userId : user.id, email : user.email };
    let token = await jwt.sign(payload, process.env.SECRET);
    return token;
}

exports.verifyToken = async (req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
        try {
            let payload = await jwt.verify(token, process.env.SECRET);
            let user = await User.findById(payload.userId);
            req.user = user;
            return next();
        } catch (error) {
            res.status(401).json({ errors : { body : [ error.toString() ]}});
        }
    } else {
        res.status(401).json({ errors : { body : [ "token required for validation" ] }});
    }
}

exports.verifyTokenOptional = async (req, res, next) => {
    if (!req.headers.authorization) {
        return next();
    }

    let token = req.headers.authorization;
    if (token) {
        try {
            let payload = await jwt.verify(token, process.env.SECRET);
            let user = await User.findById(payload.userId);
            req.user = user;
            return next();
        } catch (error) {
            res.status(401).json({ errors : { body : [ error.toString() ]}});
        }
    } else {
        res.status(401).json({ errors : { body : [ "token required for validation" ] }});
    }
}