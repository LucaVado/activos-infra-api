const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false},
    apellidoPaterno: Sequelize.STRING,
    apellidoMaterno: Sequelize.STRING,
    numeroEmpleado: Sequelize.INTEGER,
    correo: {
        type: Sequelize.STRING,
        allowNull: false},
    password: {
        type: Sequelize.STRING,
        allowNull: false},
    tipoUsuario: {
        type: Sequelize.STRING,
        allowNull: false},
});

module.exports = User;