const express = require('express')
const router = express.Router()
const { brandsController } = require('../Controllers')


router.get('/lists', brandsController.getAllBrands)


module.exports = router