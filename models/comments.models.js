const db = require("../db/connection")
const { checkIfExists } = require("../utils/utils")

exports.removeComment = (comment_id) => {
    return checkIfExists('comments', 'comment_id', comment_id)
        .then(() => {
            return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
        })
}