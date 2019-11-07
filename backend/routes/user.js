const express = require("express");
//const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
    console.log(" entrando en signup en el servidor ");
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save().then(result => {
        res.status(201).json({
            message: 'User created!',
            result: result
        })
    });
});

module.exports = router;