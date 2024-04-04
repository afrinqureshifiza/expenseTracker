const express = require('express')
const router = express.Router()
const controller = require('../controller/purchase')
const auth = require('../middleware/auth')

router.get('/premiummembership', auth.authenticate, controller.purchasepremium)

router.post('/updateTransactionStatus', auth.authenticate, controller.updateTransactionStatus)

router.post('/failedpremiummembership', auth.authenticate, controller.updatefailedTransactionStatus)

module.exports = router