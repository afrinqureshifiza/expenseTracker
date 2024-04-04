const user = require('../model/user')
const bcrypt = require('bcrypt')
const path = require('path')
const jwt = require('jsonwebtoken')


function isStringInvalid(string){
    if(string==undefined || string.length==0){
        return true
    }
    return false
}

exports.signup = (req,res)=>{
    console.log('inside post')
    try{
     const {name, email, password}= req.body; 
     
     if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)){
       return  res.status(400).json({message: 'bad parameters: missing parameters', success:false}) 
     }
    const saltrounds =10
    bcrypt.genSalt(saltrounds,(err, salt)=>{
        if(err){
            console.log(err)
            return
        }
        bcrypt.hash(password, salt, (err, hash)=>{
            if(err){
                console.log(err)
                return
            }
            user.create({ name, email, password:hash , isPremium:false })
            .then((result)=>{
             console.log(`sigunup result=> ${result.id }`)
            res.status(200).json({message: 'Successfully created new user', success:true})
            })
        })
    })
     
    } 
    catch(err){
     res.status(500).json({error:'error during creating record', success:false})
    }
    
 }

const generateToken=(id, name, ispremium)=>{
    return jwt.sign({userId:id, username:name, isPremium:ispremium}, process.env.secret_key)
}
 
exports.login= (req,res)=>{ 

    const {email, password} = req.body
    user.findOne({where:{email}}) 
    .then((result)=>{
        // console.log('hased password')
        // console.log(result.password)
        // console.log(`password ${password}`)
        if(!result){  
            console.log('user not found') 
            return res.status(404).json({message:'User not found', success:false})
        }
        else{
        bcrypt.compare(password, result.password, (err, comp)=>{
            if(err){
                console.log(err)
                return
            }
            if(comp==false){
              console.log('Password incorrect')
              
              return res.status(401).json({message:'Password incorrect', success:false})   
            }
         const token = generateToken(result.id, result.name, result.isPremium)
         console.log(`token->${token}`)
         console.log('user found login successful')
         res.status(200).json({message:'Successful Login', success:true, token:token})  
        })    
        }
            
    })
    .catch(err=>{
        res.status(500).json({message:err, success:false}) 
    })
   
} 

exports.showloginform=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','login.html'))
}

exports.showsignupform=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','signup.html'))
}

exports.showforgotpwdform=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','forgotpassword.html'))
}

exports.downloadexpense=(req,res)=>{
    const expenses = req.user
}