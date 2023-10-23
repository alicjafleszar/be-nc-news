const format = require("pg-format");
const db = require("../db/connection");

exports.selectTopics = () => {
    return db.query(
        `SELECT * FROM topics;`
    )
    .then(({ rows }) => rows)
}

exports.insertTopic = ({slug, description}) => {
    const insertTopicQueryStr = format(
        `INSERT INTO topics (slug, description) VALUES %L RETURNING *;`,
        [[ slug, description ]]
        )
    return db.query(insertTopicQueryStr)
        .then(({ rows }) => rows[0])
}