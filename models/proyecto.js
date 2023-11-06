const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Proyecto = sequelize.define('proyecto', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fechaEntrada:{
        type: Sequelize.DATE,
        allowNull: false
    },
    fechaSalida:{
        type: Sequelize.DATE,
        allowNull: false
    },
    estatus:{
        type: Sequelize.STRING,
        allowNull: false
    },
    guia:{
        type: Sequelize.STRING
    },
    razon:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Proyecto;