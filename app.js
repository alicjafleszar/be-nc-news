const express = require('express')
const topicsRouter = require('./topics')
const { getEndpointsInfo } = require('./controllers')

const app = express()
app.use(express.json())

const router = express.Router()

app.use('/api', router)

router.get('/', getEndpointsInfo)

router.use('/topics', topicsRouter)

app.all('*', (req, res, next) => {
    err = {status: 404, msg: 'Not Found'}
    next(err)
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})


module.exports = app
