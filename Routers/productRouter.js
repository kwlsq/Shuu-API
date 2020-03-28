const express = require('express')
const router = express.Router()
const { productController } = require('../Controllers')
const { auth } = require('../Helpers/auth')


router.get('/showcase', productController.showcase)
router.put('/more', productController.loadMore)
router.get('/men', productController.menShowcase)
router.get('/women', productController.womenShowcase)
router.post('/detailproduct', productController.detailProduct)
router.post('/detailproductbysize', productController.detailProductBySize)
router.post('/availsize', productController.availableSize)
router.put('/search', productController.searchProduct)

module.exports = router