const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Activo = sequelize.define('activo', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    nombre: Sequelize.STRING,
    // tipo:{
    //     type: Sequelize.STRING,
    //     allowNull: false
    // },
    numeroSerie:{
        type: Sequelize.STRING,
        allowNull: false
    },
    numeroActivo:{
        type: Sequelize.STRING,
        // allowNull: false
    },
    fechaEntrada:{
        type: Sequelize.DATE,
        // allowNull: false
    },
    fechaSalida:{
        type: Sequelize.DATE,
        allowNull: false
    },
    estatus:{
        type: Sequelize.STRING,
        allowNull: false
    },
    folio:{
        type: Sequelize.STRING,
        // allowNull: false
    },
    guia:{
        type: Sequelize.STRING,
        // allowNull: false
    },
    razon:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Activo;