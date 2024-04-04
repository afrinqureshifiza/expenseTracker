const premiumController = require('../controller/premiumfeatures')
const express = require('express')
const router = express.Router()

router.get('/showLeaderBoard', premiumController.showLeaderBoard)



module.exports = router
