const http = require('http');

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded()); 
app.use(bodyParser.json()); // application/json

const sequelize= require('./util/database');

const TipoActivo = require('./models/tipo-activo');
const Activo = require('./models/activo');
const Proyecto = require('./models/proyecto');
const Sucursal = require('./models/sucursal');
const Departamento = require('./models/departamento');
const User = require('./models/user');


app.use((req, res, next) => {
    res.setHeader('Acces-control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const activesRoutes = require('./routes/actives');
const usersRoutes = require('./routes/user');

app.use('/actives', activesRoutes);
app.use('/users', usersRoutes);

// app.listen(8080);
const server = http.createServer(app);

Activo.belongsTo(User);
// Activo.hasOne(TipoActivo);
Activo.belongsTo(TipoActivo);
Activo.belongsTo(Proyecto);
User.hasMany(Activo);
// User.belongsTo(Sucursal);
// User.belongsTo(Departamento);
// Sucursal.hasMany(User);
// Departamento.hasMany(User);
Proyecto.belongsTo(User);
Proyecto.hasMany(Activo);
User.hasMany(Proyecto);
TipoActivo.belongsTo(User);


sequelize
    .sync( { force: true })
    // .sync()    
    .then(result =>{
        server.listen(8080);
    })
    .catch(err => {
        console.log(err);
    });