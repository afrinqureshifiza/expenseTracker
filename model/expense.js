const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const expense = sequelize.define('expense',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },

    amount:Sequelize.INTEGER,

    description:Sequelize.STRING,

    category:Sequelize.STRING
})

module.exports = expense