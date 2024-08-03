const express = require('express')
const router = express.Router()
const { addPost, getPosts, getMyPosts, getUserPosts, deletePost } = require('../controllers/post')
const userVerification = require('../utils/userVerification')


router.get('/:id', getUserPosts)

router.use(userVerification)

router.post('/', addPost)
router.get('/', getPosts)
router.get('/my/get',getMyPosts)
router.delete('/:id', deletePost)


module.exports = router