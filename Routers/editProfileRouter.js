const express = require('express')
const router = express.Router()
const { editProfileController } = require('../Controllers')
const { auth } = require('../Helpers/auth')


router.post('/addprofpic', auth, editProfileController.addProfilePict)
router.post('/updateprofile/:id', auth, editProfileController.updateProfile)


module.exports = router