const { selectEndpointsInfo } = require("../models")

exports.getEndpointsInfo = (req, res, next) => {
    selectEndpointsInfo()
        .then(endpoints => res.status(200).send({ endpoints }))
        .catch(err => next(err))
}