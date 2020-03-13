const express = require('express')
const router = express.Router()
const { productController } = require('../Controllers')
const { auth } = require('../Helpers/auth')


router.get('/showcase', productController.showcase)
router.post('/detailproduct', productController.detailProduct)
router.post('/detailproductbysize', productController.detailProductBySize)
router.post('/availsize', productController.availableSize)

module.exports = router