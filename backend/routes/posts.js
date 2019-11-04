const express = require("express");
const Post = require("../models/post");

const router = express.Router();

router.post('', (req, res, next) => {
    console.log('llega el post al servidor');
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    console.log(" post to add " + post);
    post.save().then(savedPost => {
        res.status(201).json({
             message: ' Post added succesfully ', 
             postId : savedPost._id
        });
    });
});
//TeQsUh3j0CT8NeTv
//cclafuente user

router.put('/:id', (req, res, next) => {
    console.log('llega llamada a servidor');
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    console.log(" post to update " + post);
    Post.updateOne({_id: req.params.id}, post).then(updatedPost => {
        res.status(201).json({
             message: ' Post updated succesfully ', 
             postId : updatedPost._id
        });
    });
});

router.get('', (req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: ' enviado correctamente',
            posts : documents
        });
    });
});

router.get('/:id', (req, res, next) => {
   Post.findById(req.params.id).then(result => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Post not found"});
        }
   })
});

router.delete('/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({ 
            message : " Post deleted "
        });
    });
});

module.exports = router;