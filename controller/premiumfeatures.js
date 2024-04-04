const user = require('../model/user')
const expense = require('../model/expense')
const sequelize = require('../util/database')

exports.showLeaderBoard=async(req,res)=>{
  
    try{
    const userExpenses = await user.findAll({
       attributes:['id', 'name', 'totalExpenses'] 
    })
    console.log(userExpenses)
    
    res.status(200).json({userExpenses, success:true})   
    }
    
    catch(err){
        console.log(err)
        res.status(500).json({err, success:false}) 
    }
}









// attributes:['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'totalAmount']],
        // include:[
        //     {
        //         model:expense,
        //         attributes: []
        //     }
        // ],
        // group:['user.id'],
    






// console.log(User[0])
    // console.log(expenses)
    // const userExpense = {}
    // console.log(expense)

    // expenses.forEach(expense=>{
    //     if(userExpense[expense.userId]){
    //         userExpense[expense.userId] += expense.amount
    //     }
    //     else{
    //         userExpense[expense.userId] = expense.amount
    //     }
    // })
    // console.log(userExpense)
    // const userExpense = await expense.findAll({
    //     attributes:['userId', [sequelize.fn('sum', sequelize.col('expense.amount')), 'totalAmount']],
    //     group:['userId']
    // })
    
    // let userLeaderBoardDetails=[]
    // Users.forEach((user)=>{
    //     let amount = 0
    //     if(userExpense[user.id]){
    //         amount=userExpense[user.id]
    //     }
    //   userLeaderBoardDetails.push({name: user.name, totalAmount:amount })
    // })
    // console.log(userLeaderBoardDetails)
    // userLeaderBoardDetails.sort((a,b)=> b.totalAmount-a.totalAmount)