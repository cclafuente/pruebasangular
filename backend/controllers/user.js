const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.createUser = (req, res, next) => {
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
};

exports.userLogin = (req, res, next) => {
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
            token: token,
            expiresIn: "3600",
            userId: fetchedUser._id
        });

    }).catch(error => {
        return res.status(401).json({
            message: "Auth failed!"
        });
    });
};
