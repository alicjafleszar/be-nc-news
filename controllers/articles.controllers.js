const { selectArticles, selectArticleById, selectCommentsByArticleId, insertComment, updateArticle } = require('../models')

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id)
        .then(article => res.status(200).send({ article }))
            .catch(err => next(err))
}

exports.getArticles = (req, res, next) => {
    selectArticles()
        .then(articles => res.status(200).send({ articles }))
            .catch(err => next(err))
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    selectCommentsByArticleId(article_id)
        .then(comments => res.status(200).send({ comments }))
        .catch(err => next(err))
}

exports.postComment = (req, res, next) => {
    const newCommentData = req.body
    const { article_id } = req.params
    insertComment(newCommentData, article_id)
        .then(comment => res.status(201).send({ comment }))
        .catch(err => next(err))
    }
    
exports.patchArticle = (req, res, next) => {
    const { inc_votes } = req.body
    const { article_id } = req.params
    updateArticle(inc_votes, article_id)
        .then(article => res.status(200).send({ article }))
        .catch(err => next(err))
}