const http = require('http');

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const session = require('express-session');
var SequelizeSession = require('connect-session-sequelize')(session.Store);

// app.use(bodyParser.urlencoded()); 
app.use(bodyParser.json()); // application/json

const sequelize= require('./util/database');

const TipoActivo = require('./models/tipo-activo');
const Activo = require('./models/activo');
const Proyecto = require('./models/proyecto');
const Sucursal = require('./models/sucursal');
const Departamento = require('./models/departamento');
const User = require('./models/user');
const Session = require('./models/session');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const store = new SequelizeSession({
    db: sequelize,
    table: 'session',
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 4 * 60 * 60 * 1000
});

const activosRoutes = require('./routes/activos');
const tipoActivoRoutes = require('./routes/tipo-activo');
const usersRoutes = require('./routes/user');
const departamentosRoutes = require('./routes/departamentos');
const sucursalRoutes = require('./routes/sucursal');
const proyectosRoutes = require('./routes/proyectos');

app.use(session({
    secret: 'my secret', 
    store: store,
    resave: false, 
    saveUninitialized: false
}));

app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findByPk(req.session.user.id)
        .then(user => {
        req.user = user;
        next();
        })
        .catch(err => console.log(err));
});

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
Session.belongsTo(User);


sequelize
    // .sync( { force: true })
    .sync()    
    .then(result =>{
        server.listen(8080);
    })
    .catch(err => {
        console.log(err);
    });