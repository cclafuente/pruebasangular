const express = require("express");
const Post = require("../models/post");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

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
    checkAuth,
    multer({storage: storage}).single("image"), 
    (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
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
    checkAuth,
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
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(updatedPost => {
        if (updatedPost.nModified > 0){
            res.status(201).json({
                message: ' Post updated succesfully ', 
                postId : updatedPost._id
            });
        }
        else{
            res.status(401).json({ message: 'Not authorised!'});
        }
    });
});

router.get('', (req, res, next) => {
    console.log(req.query);
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let fetchedPosts;
    
    const postQuery = Post.find();


    if (pageSize && currentPage){
        postQuery
            .skip( pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents;
        return Post.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: "Post fetched succesfully",
                posts: fetchedPosts,
                maxPosts: count
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

router.delete('/:id', 
    checkAuth,
    (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
        if (result.n > 0){
            res.status(200).json({ 
                message : " Post deleted "
            });
        }else{
            res.status(401).json({ message: 'Not authorised!'});
        }
    });
});

module.exports = router;

//TeQsUh3j0CT8NeTv
//cclafuente user
