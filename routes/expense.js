const express = require('express')
const router = express.Router()
const expenseController = require('../controller/expense')
const auth= require('../middleware/auth')

router.post('/add-expense', auth.authenticate, expenseController.addexpense)

router.delete('/delete-expense/:id', auth.authenticate, expenseController.deleteexpense)

router.get('/show-expense', auth.authenticate, expenseController.showexpense)

router.get('/show-expenseform',expenseController.showform)

router.get('/download', auth.authenticate, expenseController.downloadexpense)

module.exports = router