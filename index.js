const express = require('express')
const app = express()
const port = 5000
const {PrismaClient} = require('@prisma/client')
const userRoutes = require('./routers/user')
const postRoutes = require('./routers/post')
const cors = require('cors')
const prisma = new PrismaClient()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes)
app.use('/posts', postRoutes)

// app.post('/addUser', async (req, res) => {
//     const {userName,password} = req.body
//     const user = await prisma.user.create({ data: { userName, password }})  
//     res.json(user)
// })
// app.post('/addPost', async (req, res) => {
//     const {content,userId} = req.body
//     const post = await prisma.post.create({ data: { content, userId }})   
//     res.json(post)
// })
// app.get('/getPosts', async (req, res) => {
//     // const {title,userId} = req.body
//     const post = await prisma.post.findMany({include:{User:true}})   
//     res.json(post)
// })

app.use((err, req, res, next) => {
    const error = err.message || 'internal server error';
    const statusCode = err.statusCode || 500

    res.status(statusCode).json({ error, statusCode })

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)    
})