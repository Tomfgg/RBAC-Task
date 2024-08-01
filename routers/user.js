const express = require('express')
const router = express.Router()
const { addUser, login, getMyData, getUserData } = require('../controllers/user')
const userVerification = require('../utils/userVerification')


router.post('/', addUser)
router.post('/login', login)
router.get('/:id', getUserData)

router.use(userVerification)

router.get('/', getMyData)

module.exports = router