const fs = require('fs/promises')

exports.selectEndpointsInfo = () => {
    return fs.readFile(`./endpoints.json`)
        .then(endpoints => JSON.parse(endpoints))
}