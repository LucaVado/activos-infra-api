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
    res.setHeader('Access-control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const activosRoutes = require('./routes/activos');
const tipoActivoRoutes = require('./routes/tipo-activo');
const usersRoutes = require('./routes/user');
const departamentosRoutes = require('./routes/departamentos');
const sucursalRoutes = require('./routes/sucursal');
const proyectosRoutes = require('./routes/proyectos');

app.use('/activos', activosRoutes);
app.use('/tipo-activo', tipoActivoRoutes);
app.use('/users', usersRoutes);
app.use('/departamento', departamentosRoutes);
app.use('/sucursal', sucursalRoutes);
app.use('/proyecto', proyectosRoutes);

// app.listen(8080);
const server = http.createServer(app);

Activo.belongsTo(User);
// Activo.hasOne(TipoActivo);
Activo.belongsTo(TipoActivo);
Activo.belongsTo(Proyecto);
User.hasMany(Activo);
User.belongsTo(Sucursal);
User.belongsTo(Departamento);
Sucursal.hasMany(User);
Departamento.hasMany(User);
Proyecto.belongsTo(User);
Proyecto.hasMany(Activo);
Proyecto.belongsTo(Sucursal);
User.hasMany(Proyecto);
TipoActivo.belongsTo(User);


sequelize
    // .sync( { force: true })
    .sync()    
    .then(result =>{
        server.listen(8080);
    })
    .catch(err => {
        console.log(err);
    });