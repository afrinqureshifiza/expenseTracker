const expense = require('../model/expense')
const path = require('path')
const User = require('../model/user')
const sequelize = require('../util/database')
const S3service = require('../services/s3services')
const Userservice = require('../services/userservices')
const fs = require('fs')


exports.addexpense = async(req,res)=>{
    const t =await sequelize.transaction()

    const {amount, description, category}=req.body
    const userId = req.user.userId
    console.log( req.user.username)
    


    try{
      if(amount== undefined || amount.length==0 || description== undefined || description.length==0 ||category== undefined || category.length==0 ){
        return res.status(403).json({success:false, err:{message:'missing parameters'}})
    }

        const exp = await expense.create({amount, description, category, userId}, {transaction:t})
        console.log('expense',exp)

        const user =await User.findOne({where:{id:userId}})
        console.log(user.totalExpenses)

        const totalExpenses=Number(exp.amount)+Number(user.totalExpenses)
        console.log(totalExpenses)

        await user.update({totalExpenses:totalExpenses},{transaction:t}) 
       
           await t.commit()
           res.status(200).json({success:true, exp})  
  
    } 
    catch(err){
        await t.rollback()
        console.log('error while creating record',err)
        res.status(403).json({success:false, err})
     }

} 

exports.deleteexpense=async(req,res)=>{
    const t =await sequelize.transaction()
    try{

     const userId = req.user.userId
     
     const expenseid = req.params.id
     const exp = await expense.findOne({where:{id:expenseid}})
    
    
     if(!expenseid ||  expenseid.length === 0){
        await t.rollback()
        return res.status(400).json({success:false, message:'id missing'})
     }

     const noOfRow= await expense.destroy({where:{id:expenseid, userId: req.user.userId}}, {transaction:t})
     if(noOfRow === 0){
        await t.rollback()
        return res.status(404).json({success:false, message:'data not found'})
     }
     const user =await User.findOne({where:{id:userId}})
     const amount=Number(user.totalExpenses)-Number(exp.amount)
     
     await user.update({totalExpenses:amount},{transaction:t})
     await t.commit()
     res.status(200).json({success:true, message:'Deleted Successfully'})
       
    }
    catch(err){
        console.error('Error while deleting expense:', err);
        await t.rollback()
        res.status(500).json({success:false, err})
    }
}

exports.showexpense = (req,res)=>{
    const page = req.query.page || 1
    let totalExpenses 
    const ITEM_PER_PAGE = Number(req.headers.rowsperpage)
    console.log('rows',ITEM_PER_PAGE)

    console.log(req.user)

    expense.count({where:{userId: req.user.userId}})
    .then((count)=>{
        console.log('count',count)
     totalExpenses = count
     return expense.findAll({
        where: {userId: req.user.userId},
        limit: ITEM_PER_PAGE,
        offset: (page-1)*ITEM_PER_PAGE
      })   
    })
    .then((arr)=>{
        console.log('total expenses')
        console.log(arr.length)
        res.status(200).json({
            arr,
            success:true,
            currentPage:page,
            hasNextPage:(page*ITEM_PER_PAGE)<totalExpenses,
            nextPage:Number(page)+1,
            previousPage:Number(page)-1,
            hasPreviousPage:page>1,
            lastPage:Math.ceil(totalExpenses/ITEM_PER_PAGE)
        })
    })
    .catch(err=>{
        res.status(404).json({err, success:false})
    })
}

exports.showform = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','expense.html'))
}

exports.downloadexpense=async(req,res)=>{
    try{

    const userId = req.user.userId
    const expenses =await Userservice.getExpenses(req)
    console.log(expenses)

    const stringifyExpenses = JSON.stringify(expenses)


    const filename = `Expenses${userId}/${new Date()}.txt`
    const fileURL =await S3service.uploadToS3(stringifyExpenses, filename)
    // console.log('fileurl', fileURL)
    // const filePath = path.join(__dirname,'../', 'filesDownloaded.txt')
    // fs.appendFile(filePath, fileURL, (err)=>{
    //     if (err) {
    //         console.error('Error creating file:', err);
    //         res.status(500).send('Error creating file.');
    //     } else {
    //         console.log('File created successfully.');
            
    //     } 
    // })
     res.status(200).json({fileURL, success:true}) 

    }
    catch(err){
        res.status(500).json({success:false, err})
    }
    
}


 