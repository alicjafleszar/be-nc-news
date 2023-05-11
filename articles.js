const express = require('express')
const { getArticleById, getArticles } = require('./controllers')

const articlesRouter = express.Router()

articlesRouter.get('/', getArticles)
articlesRouter.get('/:article_id', getArticleById)

module.exports = articlesRouter