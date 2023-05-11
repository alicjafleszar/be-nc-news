const { selectArticles } = require('../models')

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticles(article_id)
    .then(article => res.status(200).send({ article }))
        .catch(err => next(err))
}