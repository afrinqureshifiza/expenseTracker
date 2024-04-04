const sequelize = require('../util/database')
const Sequelize = require('sequelize')
// const UUID = require('uuid')

const Forgotpasswordrequest = sequelize.define('forgotpasswordrequest', {
    id:{
       type:Sequelize.UUID,
       allowNull: false,
       primaryKey: true 
    },
    isactive:Sequelize.BOOLEAN,

})

module.exports= Forgotpasswordrequest