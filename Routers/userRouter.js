const express = require('express')
const router = express.Router()
const { userController } = require('../Controllers')
const { auth } = require ('../Helpers/auth')


router.post('/login', userController.login)
router.get('/keeplogin', auth, userController.keepLogin)
router.get('/:username', userController.getByUsername)
router.post('/register', userController.register)

module.exports = router