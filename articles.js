const express = require('express')
const { getArticleById, getArticles, getCommentsByArticleId } = require('./controllers')

const articlesRouter = express.Router()

articlesRouter.get('/', getArticles)
articlesRouter.get('/:article_id', getArticleById)
articlesRouter.get('/:article_id/comments', getCommentsByArticleId)

module.exports = articlesRouter