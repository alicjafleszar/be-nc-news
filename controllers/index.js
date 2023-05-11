const { getEndpointsInfo } = require("./base.controllers");
const { getTopics } = require("./topics.controllers");
const { getArticleById } = require("./articles.controllers");

module.exports = { getEndpointsInfo, getTopics, getArticleById }