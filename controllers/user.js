const bcrypt = require('bcrypt')
const AppError = require('../utils/AppError')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.SECRET
const prisma = require('../utils/prismaGeneratorExPassword')
const { PrismaClient } = require('@prisma/client')
const prismaWithPassword = new PrismaClient()

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
        const user = await prismaWithPassword.user.findUnique({ where: { email } })
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


const deleteMyAccount = async (req, res, next) => {
    try {
        if (req.user.role === 'SuperAdmin') throw new AppError('SuperAdmin account can not be deleted', 401)
        await prisma.user.delete({ where: { id: req.user.id } })
        res.json('user has been deleted successfully')
    }
    catch (error) {
        next(error)
    }
}

const deleteUserAccount = async (req, res, next) => {
    try {
        const { id } = req.params
        if (req.user.role !== 'SuperAdmin' && req.user.id !== id) throw new AppError('unAuthorized', 401)
        const user = await prisma.user.findUnique({ where: { id } })
        if (user.role === 'SuperAdmin') throw new AppError('SuperAdmin account can not be deleted', 401)
        await prisma.user.delete({ where: { id } })
        res.json('user has been deleted successfully')
    }
    catch (error) {
        next(error)
    }
}

const makeAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'SuperAdmin') throw new AppError('unAuthorized', 401)
        const { id } = req.params
        if (id === req.user.id) throw new AppError('can not change the SuperAdmin role', 401)
        await prisma.user.update({ where: { id }, data: { role: 'Admin' } })
        res.json('Admin')
    }
    catch (error) {
        next(error)
    }
}

const makeUser = async (req, res, next) => {
    try {
        if (req.user.role !== 'SuperAdmin') throw new AppError('unAuthorized', 401)
        const { id } = req.params
        if (id === req.user.id) throw new AppError('can not change the SuperAdmin role', 401)
        await prisma.user.update({ where: { id }, data: { role: 'User' } })
        res.json('User')
    }
    catch (error) {
        next(error)
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        if (req.user.role !== 'SuperAdmin') throw new AppError('unAuthorized', 401)
        const users = await prisma.user.findMany({ where: { id: { not: req.user.id } } })
        res.json(users)
    }
    catch (error) {
        next(error)
    }
}

module.exports = {
    addUser, login, getMyData, deleteMyAccount, deleteUserAccount, makeAdmin, makeUser, getAllUsers
}