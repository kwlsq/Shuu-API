const express = require('express')
const router = express.Router()
const { userController } = require('../Controllers')
const { auth } = require ('../Helpers/auth')


router.post('/login', userController.login)
router.get('/register/:username', userController.register)

module.exports = router