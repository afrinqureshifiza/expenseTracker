const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const user = sequelize.define('user', {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },

    name:Sequelize.STRING,

    email:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },

    password:{
        type:Sequelize.STRING
    },
    totalExpenses:Sequelize.INTEGER,
    isPremium:Sequelize.BOOLEAN
})
 
module.exports = user