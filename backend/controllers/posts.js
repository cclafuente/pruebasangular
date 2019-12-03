const Post = require("../models/post");

exports.createPost = (req, res, next) => {
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
    });
};

exports.updatePost = (req, res, next) => {
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
        if (updatedPost.n > 0){
            res.status(201).json({
                message: ' Post updated succesfully ', 
                postId : updatedPost._id
            });
        }
        else{
            res.status(401).json({ message: 'Not authorised!'});
        }
    });
};

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(result => {
         if (result) {
             res.status(200).json(result);
         } else {
             res.status(404).json({ message: "Post not found"});
         }
    })
 };

exports.getPosts = (req, res, next) => {
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
};

exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
        if (result.n > 0){
            res.status(200).json({ 
                message : " Post deleted "
            });
        }else{
            res.status(401).json({ message: 'Not authorised!'});
        }
    });
};