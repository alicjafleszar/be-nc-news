const express = require('express')
const topicsRouter = require('./topics')

const app = express()
app.use(express.json())

app.use('/api/topics', topicsRouter)

app.use((req, res, next) => {
    res.status(404).send({msg: 'Not Found'})
    return next(err)
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})


module.exports = app
