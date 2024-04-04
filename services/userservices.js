const expense = require('../model/expense')

exports.getExpenses =async(req)=>{
   const userId = req.user.userId
   const expenses = await expense.findAll({where:{userId:userId}})
   return expenses
}