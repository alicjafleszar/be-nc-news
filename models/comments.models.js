const db = require("../db/connection")
const { checkIfExists } = require("../utils/utils")

exports.removeComment = (comment_id) => {
    return checkIfExists('comments', 'comment_id', comment_id)
        .then(() => {
            return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
        })
}

exports.updateComment = (inc_votes, comment_id) => {
    return Promise.all([
        checkIfExists('comments', 'comment_id', comment_id),
        db.query(`
            UPDATE comments 
            SET votes = votes + $1 
            WHERE comment_id = ${comment_id} 
            RETURNING *;
        `, [inc_votes])
    ]).then(([ exists, { rows } ]) => rows[0])
}