const express = require('express')
const { getArticleById, getArticles, getCommentsByArticleId, postComment, patchArticle } = require('./controllers')

const articlesRouter = express.Router()

articlesRouter.get('/', getArticles)
articlesRouter.get('/:article_id', getArticleById)
articlesRouter.get('/:article_id/comments', getCommentsByArticleId)

articlesRouter.post('/:article_id/comments', postComment)

articlesRouter.patch('/:article_id', patchArticle)

module.exports = articlesRouter