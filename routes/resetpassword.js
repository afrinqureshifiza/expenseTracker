const express = require('express')
const router = express.Router()
const passwordcontroller = require('../controller/resetpassword')
const auth= require('../middleware/auth')

router.post('/forgotpassword',  passwordcontroller.retrivepassword)

router.get('/resetpassword/:id', passwordcontroller.resetPassword)

router.get('/updatepassword/:userId', passwordcontroller.updatepassword)

module.exports = router