const db = require('../db/connection')

exports.selectArticleById = (article_id) => {
    if(!Number.isInteger(+article_id)) return Promise.reject({ status: 400, msg: 'Invalid Article ID' })
    return db
        .query(
            `SELECT * FROM articles
            WHERE article_id = $1;`,
            [ article_id ]
        )
        .then(({ rows }) => {
            if (!rows.length) return Promise.reject({ status: 404, msg: 'Article ID Not Found' })
            return rows[0]
        })
}

exports.selectArticles = () => {
    return db
        .query(
            `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.article_img_url, articles.votes, COUNT(comments.article_id)::INTEGER AS comment_count
            FROM articles
            FULL JOIN comments
            ON articles.article_id = comments.article_id
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;`
        )
        .then(({ rows }) => rows)
}