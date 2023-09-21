const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Departamento = sequelize.define('departamento', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    nombre: Sequelize.STRING,
});

module.exports = Departamento;