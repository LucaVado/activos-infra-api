const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Proyecto = sequelize.define('proyecto', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    nombre: Sequelize.STRING,
    fechaEntrada:{
        type: Sequelize.DATE,
        allowNull: false
    },
    fechaSalida:{
        type: Sequelize.DATE,
        allowNull: false
    }
});

module.exports = Proyecto;