const express = require('express')
const router = express.Router()
const { productController } = require('../Controllers')
// const { auth } = require('../Helpers/auth')


router.get('/showcase', productController.showcase)

module.exports = router