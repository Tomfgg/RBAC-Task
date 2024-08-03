const express = require('express')
const router = express.Router()
const { addUser, login, getMyData, deleteMyAccount, deleteUserAccount, makeAdmin, makeUser, getAllUsers } = require('../controllers/user')
const userVerification = require('../utils/userVerification')


router.post('/', addUser)
router.post('/login', login)

router.use(userVerification)

router.get('/', getMyData)
router.get('/allUsers', getAllUsers)
router.delete('/my', deleteMyAccount)
router.delete('/:id', deleteUserAccount)
router.post('/:id/admin', makeAdmin)
router.post('/:id/user', makeUser)

module.exports = router