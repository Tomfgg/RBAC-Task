const express = require('express')
const router = express.Router()
const { addPost, getPosts,  deletePost } = require('../controllers/post')
const userVerification = require('../utils/userVerification')



router.use(userVerification)

router.post('/', addPost)
router.get('/', getPosts)
router.delete('/:id', deletePost)


module.exports = router