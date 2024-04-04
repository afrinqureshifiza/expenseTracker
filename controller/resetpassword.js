const User= require('../model/user')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const sib = require('sib-api-v3-sdk')
const Forgotpasswordrequest = require('../model/forgotpasswordrequest')


exports.retrivepassword=async (req,res)=>{
  try{
    // alert('check your mail')
    console.log('req->',req.body.email)
    const Email = req.body.email
    const user = await User.findOne({where:{email:Email}})
    console.log(user)

    if(user){

      const newid = uuid.v4()
      Forgotpasswordrequest.create({id:newid,isactive:true, userId:user.id}) 
      .catch(err=> console.log('error while adding forgot pwd record', err))

      const client = sib.ApiClient.instance
      
      const apikey = client.authentications['api-key']
      apikey.apiKey = process.env.RESETPWD_API_KEY

      const transEmailApi = new sib.TransactionalEmailsApi()

      const sender={
        email:'fizaafrinqureshi@gmail.com',
        name:'Afrin'
      }

      const reciever=[
        {
            email:Email
        }
      ]

      transEmailApi.sendTransacEmail({
        sender,
        to:reciever,
        subject:'Reset Password Email !!!',
        htmlContent:`<h4>This is an email to reset your password ,click on the link below to reset</h4>
        <a href='http://localhost:3000/password/resetpassword/${newid}'>click here</a>`
      })
      .then((msg)=>{
        console.log(msg)
        res.status(200).json({message:'link sent to your email'})
      })
      .catch(err=>{
        throw new Error(err)
      })
    }
    else{
        throw new Error('User donot exist')
    }
  }
  catch(err){
     res.status(401).json({message:err})
  }
    
}

exports.resetPassword=async(req,res)=>{
   try{
    const id = req.params.id 
   const request = await Forgotpasswordrequest.findOne({where:{id, isactive:true}})
   
   if(request){
    request.update({isactive:false})
    res.status(200).send(
        `<html>
         <form action='/password/updatepassword/${request.userId}' method='get'>
           <label>Enter new password:
           <input type='password' name='newpassword' required>
           </label>
           <button>Reset Password</button>
         </form>
        </html>`
    )
   }
   }
   catch(err){
    res.status(401).json({message:err})
   }
}

exports.updatepassword=async(req,res)=>{
   try{
    const userId = req.params.userId
    console.log('query=',req.query)
    const {newpassword} = req.query
    console.log('new=',newpassword)
   const user = await User.findOne({where:{id:userId}})
   console.log(user)
   if(user){
    bcrypt.genSalt(10,(err, salt)=>{
        if(err){
            throw new Error(err)
        }

        bcrypt.hash(newpassword, salt, async(err,hash)=>{
            if(err){
                throw new Error(err)
            } 
           await user.update({password:hash})
           console.log('updated successfully')
           res.status(200).json({message:'Password updated successfully'})
        })
    })
   }
   else{
    throw new Error('User do not exist')
   }
   }
   catch(err){
    console.log(err)
    res.status(500).json(err)
   }
}