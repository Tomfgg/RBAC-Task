const express = require('express')
const router = express.Router()
const { addUser, login, getMyData, getUserData, deleteMyAccount, deleteUserAccount,makeAdmin,makeUser } = require('../controllers/user')
const userVerification = require('../utils/userVerification')


router.post('/', addUser)
router.post('/login', login)
router.get('/:id', getUserData)

router.use(userVerification)

router.get('/', getMyData)
router.delete('/my', deleteMyAccount)
router.delete('/:id', deleteUserAccount)
router.post('/:id/admin', makeAdmin)
router.post('/:id/user', makeUser)

module.exports = router