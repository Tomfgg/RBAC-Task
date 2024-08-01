const express = require('express')
const router = express.Router()
const { addPost, getPosts, getMyPosts, getUserPosts } = require('../controllers/post')
const userVerification = require('../utils/userVerification')

router.get('/', getPosts)
router.get('/:id', getUserPosts)

router.use(userVerification)

router.post('/', addPost)
router.get('/my/get',getMyPosts)

module.exports = router