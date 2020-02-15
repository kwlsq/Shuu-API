const express = require('express')
const { brandsController } = require('../Controllers')

const router = express.Router()

router.get('/lists', brandsController.getAllBrands)


module.exports = router