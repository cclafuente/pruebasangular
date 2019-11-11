const express = require("express");
//const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

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

//probando post
router.post("/login", (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email})
    .then(user => {
        if (!user){
            return res.status(401).json({
                message: "Auth failed!"
            });
        }
        fetchedUser = user;
        return req.body.password == user.password;
    }).then(result => {
        const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, 
            'secreto_creador_token',
            {expiresIn: "1h"});
        
        res.status(200).json({
            token: token
        });

    }).catch(error => {
        return res.status(401).json({
            message: "Auth failed!"
        });
    });
});


module.exports = router;