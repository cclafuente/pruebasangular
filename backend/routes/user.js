const express = require("express");
//const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save();
});

module.exports = router;