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
    const posts = await prisma.post.findMany({
        include: { user: true }, 
        orderBy: {
            createdAt: 'desc', 
        }, })
    res.json(posts)
}

const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params
        const post = await prisma.post.findUnique({ where: { id } })
        if (!post) throw new AppError('post not found', 404)
        if (req.user.id !== post.userId && req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') throw new AppError('unAuthorized', 401)
        await prisma.post.delete({where:{id}})
        res.json('user successfully deleted')
    }
    catch (error) {
        next(error)
    }
}

module.exports = { addPost, getPosts, deletePost }