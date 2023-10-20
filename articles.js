const express = require('express')
const { getArticleById, getArticles, getCommentsByArticleId, postComment, patchArticle, postArticle, deleteArticleById } = require('./controllers')

const articlesRouter = express.Router()

articlesRouter.get('/', getArticles)
articlesRouter.get('/:article_id', getArticleById)
articlesRouter.get('/:article_id/comments', getCommentsByArticleId)

articlesRouter.post('/', postArticle)
articlesRouter.post('/:article_id/comments', postComment)

articlesRouter.patch('/:article_id', patchArticle)

articlesRouter.delete('/:article_id', deleteArticleById)

module.exports = articlesRouter