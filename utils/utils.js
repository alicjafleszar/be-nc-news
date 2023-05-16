const db = require('../db/connection')
const format = require('pg-format');

exports.checkIfExists = (table, column, value) => {
    const queryStr = format(`
        SELECT EXISTS (
            SELECT *
            FROM %I
            WHERE %I = $1
        );
    `, table, column)
    return db
        .query(queryStr, [value])
        .then(({ rows: [ { exists } ] }) => {
            console.log(exists)
            if (!exists) return Promise.reject({ status: 404, msg: 'Not Found' })
        })
}