const sequelize = require('../util/database')
const Sequelize = require('sequelize')

const order = sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },

    paymentId: Sequelize.STRING,
    orderId: Sequelize.STRING,
    status: Sequelize.STRING,
})

module.exports = order