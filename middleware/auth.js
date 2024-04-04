const jwt = require('jsonwebtoken')

exports.authenticate = (req,res,next)=>{
   try{
   const token = req.header('Authorisation')
   console.log(`token ${token}`)
   const user = jwt.verify(token, process.env.secret_key)
   console.log(user)
   req.user= user
   next()
   }
   catch(err){
      console.log(`error aaya ${err}`)
   }
   
}
