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
    numeroEmpleado: Sequelize.INTEGER,
    // {
    //     type: Sequelize.INTEGER,
    //     allowNull: false
    // },
    correo: Sequelize.STRING,
    password: Sequelize.STRING,
    tipoUsuario: Sequelize.STRING
});

module.exports = User;