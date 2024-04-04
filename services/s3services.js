const AWS = require('aws-sdk')
exports.uploadToS3=async(data, filename)=>{
    try{
      let s3 = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
    })

    
    let params = {
       Bucket: process.env.BUCKET_NAME,
       Key: filename,
       Body: data,
       ACL: 'public-read'
    } 

    return new Promise((resolve, reject)=>{
       s3.upload(params, (err, s3response)=>{
      if(err){
        console.log('something went wrong', err)
        reject(err)
      }
      console.log('success', s3response)
      resolve(s3response.Location)
      }) 
    })
      
    }
    catch(err){
        console.log(err)
    }
   
}