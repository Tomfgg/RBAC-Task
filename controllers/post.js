const AppError = require('../utils/AppError')
const prisma = require('../utils/prismaGeneratorExPassword')


const addPost = async (req, res, next) => {
    try {
        const { content } = req.body
        if (!content) throw new AppError('post content missing', 400)
        const user = req.user
        await prisma.post.create({ data: { 'userId': user.id, content } })
        res.json('post created successfully')
    }
    catch (err) { next(err) }
}

const getPosts = async (req, res, next) => {
    const posts = await prisma.post.findMany({ include: { user: true } })
    res.json(posts)
}

const getMyPosts = async (req, res, next) => {
    const posts = await prisma.post.findMany({ where: { userId: req.user.id } })
    res.json(posts)
}

const getUserPosts = async (req, res, next) => {
    const {id} = req.params
    const posts = await prisma.post.findMany({ where: { userId: id } })
    res.json(posts)
}

module.exports = { addPost, getPosts, getMyPosts, getUserPosts }