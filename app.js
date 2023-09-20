const http = require('http');

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const activesRoutes = require('./routes/actives');

// app.use(bodyParser.urlencoded()); 
app.use(bodyParser.json()); // application/json

const sequelize= require('./util/database');


app.use((req, res, next) => {
    res.setHeader('Acces-control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/actives', activesRoutes);

// app.listen(8080);
const server = http.createServer(app);


sequelize
    // .sync( { force: true })
    .sync()    
    .then(result =>{
        server.listen(8080);
    })
    .catch(err => {
        console.log(err);
    });