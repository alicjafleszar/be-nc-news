const { removeComment } = require("../models")

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params
    removeComment(comment_id)
        .then(() => res.status(204).send('No Content'))
        .catch(err => next(err))
}