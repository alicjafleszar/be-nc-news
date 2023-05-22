const express = require('express')
const topicsRouter = require('./topics')
const articlesRouter = require('./articles')
const commentsRouter = require('./comments')
const usersRouter = require('./users')
const { getEndpointsInfo } = require('./controllers')

const app = express()
app.use(express.json())

const router = express.Router()

app.use('/api', router)

router.get('/', getEndpointsInfo)

router.use('/topics', topicsRouter)

router.use('/articles', articlesRouter)

router.use('/comments', commentsRouter)

router.use('/users', usersRouter)

app.all('*', (req, res, next) => {
    err = {status: 404, msg: 'Not Found'}
    next(err)
})

app.use((err, req, res, next) => {
    if (['23502', '22P02', '42703'].includes(err.code)) {
        res.status(400).send({msg: 'Invalid Request'})
    } else if (err.code === '23503'){
        res.status(404).send({msg: 'Not Found'})
    } else if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})


module.exports = app
