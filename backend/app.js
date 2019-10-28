const express = require('express');

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.post('/api/posts', (req, res, next) => {
    console.log('gestionando posts');
    next();
});


app.get('/api/posts', (req, res, next) => {
    const posts = [
        { id: '1', title:'Titulo 1', content:'contenido post 1'},
        { id: '2', title:'Titulo 2', content:'contenido post 2'},
        { id: '3', title:'Titulo 3', content:'contenido post 3'}
    ];
    res.status(200).json({
        message: ' enviado correctamente',
        posts : posts
    });
});

module.exports = app;