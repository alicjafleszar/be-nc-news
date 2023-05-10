const fs = require('fs/promises')

exports.getEndpointsInfo = (req, res, next) => {
    return fs.readFile(`./endpoints.json`)
        .then(endpoints => res.status(200).send({ endpoints: JSON.parse(endpoints) }))
        .catch(err => next(err))
}