const express = require("express");
const Post = require("../models/post");
const multer = require("multer");

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        error = new Error(" Invalid mime type");
        if (isValid){
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const nombre = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, nombre + '-' + Date.now() + '.' + ext);
    }
});

router.post("", 
    multer({storage: storage}).single("image"), 
    (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    post.save().then(savedPost => {
        res.status(201).json({
             message: ' Post added succesfully ', 
             post : {
                 _id: savedPost.id,
                 title: savedPost.title,
                 content: savedPost.content,
                 imagePath: savedPost.imagePath
            }
        })
    })
});

router.put('/:id', 
    multer({storage: storage}).single("image"), 
    (req, res, next) => {
        let imagePath;
        if (req.file){
            const url = req.protocol + "://" + req.get("host");
            imagePath = url + "/images/" + req.file.filename;

        }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
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

//TeQsUh3j0CT8NeTv
//cclafuente user
