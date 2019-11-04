const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

mongoose.connect("mongodb+srv://cclafuente:TeQsUh3j0CT8NeTv@cluster0-91zhf.gcp.mongodb.net/node-angular?retryWrites=true&w=majority")
    .then(() => {
        console.log(' Connected to de database');
    })
    .catch(() => {
        console.log(' Connection failed');
    });

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;