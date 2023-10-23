const db = require('../db/connection')
const format = require('pg-format');
const { checkIfExists } = require('../utils/utils')

exports.selectArticleById = (article_id) => {
    return Promise.all([
        checkIfExists('articles', 'article_id', article_id),
        db.query(`
            SELECT articles.*, COUNT(comments.article_id)::INTEGER AS comment_count
            FROM articles
            FULL JOIN comments
            ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1
            GROUP BY articles.article_id;`,
            [ article_id ]
        )
    ]).then(([ exists, { rows } ]) => rows[0])
}

exports.selectArticles = ({ sort_by = 'created_at', order = 'desc', topic, limit = 10, p = 1 }) => {
    if (!['asc', 'desc'].includes(order) || isNaN(limit) || isNaN(p)) return Promise.reject({ 
        status: 400,
        msg: 'Invalid Request'
     })
    const selectArticlesQueryStr = format(`
        SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.article_img_url, articles.votes, COUNT(comments.article_id)::INTEGER AS comment_count
        FROM articles
        FULL JOIN comments
        ON articles.article_id = comments.article_id
        ${topic ? 'WHERE articles.topic = $1' : ''}
        GROUP BY articles.article_id
        ORDER BY %I ${order}
        OFFSET ${(p - 1) * limit} ROWS
        FETCH NEXT ${limit} ROWS ONLY;
    `, [sort_by])

    return db
        .query('SELECT slug FROM topics;')
        .then(({ rows }) => {
            if (topic && !rows.map(topic => topic.slug).includes(topic)) return Promise.reject({ 
                status: 404,
                msg: 'Not Found'
             })
        })
        .then(() => {
            return db.query(selectArticlesQueryStr, topic ? [topic] : null)
            .then(({ rows }) => {
                return Promise.all([
                    rows, 
                    db.query(`SELECT COUNT(*) FROM articles ${topic ? 'WHERE articles.topic = $1' : ''};`, topic ? [topic] : null)
                ])
            })
            .then(([articles, { rows }]) => {
                const total_count = rows[0].count
                return { total_count, articles }
            })
        })
        
}

exports.selectCommentsByArticleId = ({ limit = 10, p = 1 }, article_id) => {
    return Promise.all([
        checkIfExists('articles', 'article_id', article_id),
        db.query(`
            SELECT * FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC
            OFFSET ${(p - 1) * limit} ROWS
            FETCH NEXT ${limit} ROWS ONLY;`,
            [ article_id ]
        )
    ]).then(([exists, { rows }]) => rows)
}

exports.insertComment = ({ username, body }, article_id) => {
    const insertCommentQueryStr = format(
        `INSERT INTO comments (body, article_id, author) VALUES %L RETURNING *;`,
        [[ body, article_id, username ]]
        )
    return Promise.all([
        checkIfExists('articles', 'article_id', article_id),
        db.query(insertCommentQueryStr)
    ]).then(([exists, { rows }]) => rows[0])
}

exports.insertArticle = ({author, title, body, topic, article_img_url}) => {
    const insertArticleQueryStr = format(
        `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES %L RETURNING *,
        (SELECT COUNT(*)
        FROM comments
        WHERE comments.article_id = articles.article_id)::INTEGER AS comment_count;;`,
        [[ author, title, body, topic, article_img_url ]]
        )
    return Promise.all([
        checkIfExists('topics', 'slug', topic),
        db.query(insertArticleQueryStr)
    ]).then(([exists, { rows }]) => rows[0])
}

exports.updateArticle = (inc_votes, article_id) => {
    return Promise.all([
        checkIfExists('articles', 'article_id', article_id),
        db.query(`
            UPDATE articles 
            SET votes = $1 
            WHERE article_id = ${article_id} 
            RETURNING *,
                (SELECT COUNT(*)
                FROM comments
                WHERE comments.article_id = articles.article_id)::INTEGER AS comment_count;
        `, [inc_votes])
    ]).then(([ exists, { rows } ]) => rows[0])
}

exports.removeArticle = (article_id) => {
    return checkIfExists('articles', 'article_id', article_id)
        .then(() => {
            return db.query(`DELETE FROM articles WHERE article_id = $1;`, [article_id])
        })
}