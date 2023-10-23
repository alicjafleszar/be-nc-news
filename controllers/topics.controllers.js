const { selectTopics, insertTopic } = require("../models")

exports.getTopics = (req, res, next) => {
    selectTopics()
        .then(topics => res.status(200).send({ topics }))
        .catch(err => {
            next(err)
        })
}

exports.postTopic = (req, res, next) => {
    const newTopicData = req.body
    insertTopic(newTopicData)
        .then(topic => res.status(201).send({ topic }))
        .catch(err => next(err))
}