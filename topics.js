const express = require('express')
const { getTopics, postTopic } = require('./controllers')

const topicsRouter = express.Router()

topicsRouter.get('/', getTopics)

topicsRouter.post('/', postTopic)

module.exports = topicsRouter