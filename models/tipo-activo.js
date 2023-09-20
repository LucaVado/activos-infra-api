const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const TipoActivo = sequelize.define('tipoActivo', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    nombre: Sequelize.STRING,
    tipo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    codigo:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    modelo:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;