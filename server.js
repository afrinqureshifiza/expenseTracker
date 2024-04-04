const express = require('express')
const app = express()
app.use(express.json())
const compression = require('compression')
app.use(compression())
const path = require('path')
const cors= require('cors')
require('dotenv').config()

//models 
const User = require('./model/user')
const Expense = require('./model/expense')
const Order = require('./model/orders')
const Forgotpasswordrequest = require('./model/forgotpasswordrequest')

//routes
const sequelize = require('./util/database')
const userrouter = require('./routes/user')
const expenserouter = require('./routes/expense')
const purchaserouter = require('./routes/purchase')
const premiumrouter = require('./routes/premiumfeature')
const passwordrouter = require('./routes/resetpassword')

app.use(cors()) 

app.use(express.static(path.join(__dirname,'public')))

app.use('/user',userrouter) 
app.use('/expense',expenserouter) 
app.use('/purchase',purchaserouter) 
app.use('/premium', premiumrouter)
app.use('/password', passwordrouter)



User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(Forgotpasswordrequest)
Forgotpasswordrequest.belongsTo(User)

sequelize.sync()
.then(()=>{
    app.listen(process.env.PORT||3000, ()=>{
        console.log('running')
    })
})
// {force:true}