const bcrypt = require('bcrypt')
const AppError = require('../utils/AppError')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.SECRET
const prisma = require('../utils/prismaGeneratorExPassword')

const addUser = async (req, res, next) => {
    try {
        const { userName, email, password, confirmPassword } = req.body
        if (password !== confirmPassword) throw new AppError('Passwords did not match', 400)
        if (!userName || !password || !confirmPassword) throw new AppError('missing credentials', 400)
        if (password.length < 5) throw new AppError('Password should have at least 5 characters', 400)
        if (userName.length < 3) throw new AppError('Username should have at least 3 characters', 400)
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(userName)) {
            throw new AppError('Name should only contain English characters.', 400);
        }
        const user1 = await prisma.user.findUnique({ where: { email: email } })
        if (user1) throw new AppError('email already exists', 409)
        const user = await prisma.user.findUnique({ where: { userName: userName } })
        if (user) throw new AppError('userName already exists', 409)
        const hashedPassword = await bcrypt.hash(password, 10)
        const userCreated = await prisma.user.create({ data: { userName, 'password': hashedPassword, email } })
        userCreated.password = undefined
        res.status(201).send(userCreated)
    }
    catch (err) {
        next(err)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) throw new AppError('missing credentials', 400)
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) throw new AppError('invalid credientials', 404)
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) throw new AppError('invalid credientials', 404)
        const token = jwt.sign({ id: user.id }, secret)
        res.status(200).json({ token })
    }
    catch (err) {
        next(err)
    }
}

const getMyData = async (req, res, next) => {
    res.json(req.user)
}

const getUserData = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await prisma.user.findUnique({ where: { id } })
        if (!user) throw new AppError('user not found', 404)
        res.json(user)
    }
    catch (error) {
        next(error)
    }
}

module.exports = {
    addUser, login, getMyData, getUserData
}