const express = require('express')
const router = express.Router()
const userController = require('../controller/user')
const auth = require('../middleware/auth')


router.post('/signup', userController.signup)

router.post('/login', userController.login)

router.get('/show-loginform', userController.showloginform)

router.get('/show-signupform', userController.showsignupform)

router.get('/forgotpasswordform', userController.showforgotpwdform)

module.exports = router