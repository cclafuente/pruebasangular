const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://cclafuente:TeQsUh3j0CT8NeTv@cluster0-91zhf.gcp.mongodb.net/node-angular?retryWrites=true&w=majority")
    .then(() => {
        console.log(' Connected to de database');
    })
    .catch(() => {
        console.log(' Connection failed');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    console.log(' entrando post ' + post);
    post.save().then(savedPost => {
        res.status(201).json({
             message: ' Post added succesfully ', 
             postId : savedPost._id
        });
    });
});
//TeQsUh3j0CT8NeTv
//cclafuente user

app.get('/api/posts', (req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: ' enviado correctamente',
            posts : documents
        });
    });
});

app.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({ 
            message : " Post deleted "
        });
    });
});

module.exports = app;