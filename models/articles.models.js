const db = require('../db/connection')
const { checkIfExists } = require('../utils/utils')

exports.selectArticleById = (article_id) => {
    if(!Number.isInteger(+article_id)) return Promise.reject({ status: 400, msg: 'Invalid Request' })
    return Promise.all([
        checkIfExists('articles', 'article_id', article_id),
        db.query(`
            SELECT * FROM articles
            WHERE article_id = $1;`,
            [ article_id ]
        )
    ]).then(([ exists, { rows } ]) => rows[0])
}

exports.selectArticles = () => {
    return db
        .query(`
            SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.article_img_url, articles.votes, COUNT(comments.article_id)::INTEGER AS comment_count
            FROM articles
            FULL JOIN comments
            ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;
        `)
        .then(({ rows }) => rows)
}

exports.selectCommentsByArticleId = (article_id) => {
    if(!Number.isInteger(+article_id)) return Promise.reject({ status: 400, msg: 'Invalid Request' })
    return Promise.all([
        checkIfExists('articles', 'article_id', article_id),
        db.query(`
            SELECT * FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC;`,
            [ article_id ]
        )
    ]).then(([exists, { rows }]) => rows)
}