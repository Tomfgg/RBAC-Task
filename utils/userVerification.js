const prisma = require('../utils/prismaGeneratorExPassword')
const AppError = require('../utils/AppError')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.SECRET

const userVerification = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next(new AppError('please provide a token', 401))
    jwt.verify(token, secret, async (err, decode) => {
        try {
            if (err) {
                if (err.name == 'TokenExpiredError') throw new AppError('token expired', 401)
                else if (err.name == 'JsonWebTokenError') throw new AppError('invalid token', 401)
                else throw new AppError('unexpected error', 401)
            }
            const { id } = decode
            const user = await prisma.user.findUnique({where:{id}})
            if (!user)  throw new AppError("user not found",404) 
            req.user = user
            next()
        }
        catch (err) {
            next(err)
        }
    })
}

module.exports = userVerification