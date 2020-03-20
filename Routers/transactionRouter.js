const express = require('express')
const router = express.Router()
const { auth } = require('../Helpers/auth')
const { transactionController } = require('../Controllers')


router.post('/addtocart', auth, transactionController.addToCart)
router.get('/cart', auth, transactionController.getCartValuesByUserId)
router.put('/changeqty', auth, transactionController.changeQty)
router.get('/gettotalpayment', auth, transactionController.getTotalPayment)
router.get('/deleteall', auth, transactionController.deleteAllByUserId)
router.put('/deleteproduct', auth, transactionController.deleteProduct)
router.post('/receipt', auth, transactionController.uploadPaymentReceipt)
router.get('/history', auth, transactionController.getTransactionHistory)



module.exports = router