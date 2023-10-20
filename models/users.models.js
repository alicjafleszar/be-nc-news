const db = require('../db/connection')
const { checkIfExists } = require('../utils/utils')

exports.selectUsers = () => {
    return db.query(`
            SELECT * FROM users;
        `)
        .then(({ rows }) => rows)
}

exports.selectUser = (username) => {
    return Promise.all([
        checkIfExists('users', 'username', username),
        db.query(`SELECT * FROM users WHERE username = $1;`, [username])
    ])
        .then(([ exists, { rows } ]) => rows[0])
}