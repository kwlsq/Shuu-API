const express = require('express')
const router = express.Router()
const { rajaOngkirController } = require('../Controllers')


router.get('/province', rajaOngkirController.getProvince)
router.get('/city/:id', rajaOngkirController.getCityByProvince)
router.get('/city', rajaOngkirController.getCity)


module.exports = router