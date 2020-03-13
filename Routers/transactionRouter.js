const express = require('express')
const router = express.Router()
const { auth } = require('../Helpers/auth')
const { transactionController } = require('../Controllers')


router.post('/addtocart', auth, transactionController.addToCart)



module.exports = router