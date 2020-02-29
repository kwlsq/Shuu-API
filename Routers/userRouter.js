const express = require('express')
const router = express.Router()
const { userController } = require('../Controllers')
const { auth } = require('../Helpers/auth')


router.post('/login', userController.login)
router.get('/keeplogin', auth, userController.keepLogin)
router.get('/:username', userController.getByUsername)
router.get('/', auth, userController.getUsersData)
router.post('/register', userController.register)
router.post('/verify', userController.emailVerification)

module.exports = router