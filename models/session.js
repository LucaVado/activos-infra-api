const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Session = sequelize.define('session',{
    sid:{
        type: Sequelize.STRING,
        primaryKey: true
    },
    expires: Sequelize.DATE,
    data: Sequelize.STRING(5000)
});

module.exports = Session;