const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Sucursal = sequelize.define('sucursal', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    iata:{
        type: Sequelize.STRING,
        allowNull: false
    },
    nombre: Sequelize.STRING,
    latitud:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    longitud:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    estado:{
        type: Sequelize.STRING,
        allowNull: false
    },
});

module.exports = Sucursal;