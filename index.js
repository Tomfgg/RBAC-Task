const express = require('express')
const app = express()
require('dotenv').config
const port = process.env.PORT || 5000
const userRoutes = require('./routers/user')
const postRoutes = require('./routers/post')
const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes)
app.use('/posts', postRoutes)


app.use((err, req, res, next) => {
    const error = err.message || 'internal server error';
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({ error, statusCode })

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)    
})