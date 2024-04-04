const Razorpay = require('razorpay')
const Order = require('../model/orders')
const user= require('../model/user')
const userController = require('../controller/user')
const jwt = require('jsonwebtoken')

exports.purchasepremium = async(req, res)=>{
    try{
      const userId = req.user.userId
      let rzp=new Razorpay({              
        key_id : process.env.RAZORPAY_KEY_ID,
        key_secret : process.env.RAZORPAY_KEY_SECRET
      })
       console.log('a') 
      const amount = 2500
      
      rzp.orders.create({amount, currency:'INR'}, (err, order)=>{
        console.log(`order ${order.id}`)
        console.log(`order ${userId}`)
        if(err){
            throw new Error(err)
            // JSON.stringify(err)
        }
        Order.create({orderId:order.id, status:'PENDING', userId})
        .then(()=>{
            res.status(200).json({order, key_id: rzp.key_id})
        })
        .catch(err=>{
            console.log(err)
            throw new Error(err)
        })
      })

    }
    catch(err){
       res.status(500).json({message:'Something went wrong'})
    }
}

const generateToken=(id, name, ispremium)=>{
  const secret_key='jkhdsc08wyed9u473t28y308y036033w9u09797wy387te28g33w'
  return jwt.sign({userId:id, username:name, isPremium:ispremium}, process.env.secret_key)
}

exports.updateTransactionStatus = async(req, res)=>{
    try{
      const userId = req.user.userId
      const {order_id, payment_id}= req.body
      console.log(`${order_id}, ==${payment_id}`)
      // const decodedToken= req.header('decoded')
      // decodedToken.isPremium=false

      const order= await Order.findOne({where:{orderId: order_id}})
      const promise1= order.update({paymentId:payment_id, status:'Success'})
      const u = await user.findOne({where:{id: userId}})
      const promise2= u.update({isPremium:true}) 
      
      Promise.all([promise1, promise2]).then(()=>{
        res.status(202).json({success:true, message:'Transaction Successful', token: generateToken(userId, undefined, true)})
      })
    }
    catch(err){
      this.updatefailedTransactionStatus(req)
      // console.error('Transaction failed:', err);
      // res.status(500).json({ success: false, message: 'Transaction failed' });   
    }
}

exports.updatefailedTransactionStatus=async(req,res)=>{
  const {order_id}= req.body
  const userId = req.user.userId
  console.log(order_id)
 
    const order= await Order.findOne({where:{orderId: order_id}})
    const promise1= order.update({paymentId:'fail', status:'Failed'})
    const u = await user.findOne({where:{id: userId}})
    const promise2= u.update({isPremium:false}) 
      
    Promise.all([promise1, promise2]).then(()=>{
      res.status(202).json({success:true, message:'faliure of payment'})
    })
    .catch((err)=>{
    res.status(500).json({ success: false, message: 'fail updation failed' });    
    })
}