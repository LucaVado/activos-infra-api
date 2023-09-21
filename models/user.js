const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    nombre: Sequelize.STRING,
    apellidoPaterno: Sequelize.STRING,
    apellidoMaterno: Sequelize.STRING,
    numeroEmpleado:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    correo: Sequelize.STRING,
    contraseña: Sequelize.STRING,
    tipoUsuario: Sequelize.STRING
});

module.exports = User;