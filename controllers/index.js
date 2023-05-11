const { getEndpointsInfo } = require("./base.controllers");
const { getTopics } = require("./topics.controllers");
const { getArticleById, getArticles } = require("./articles.controllers");

module.exports = { getEndpointsInfo, getTopics, getArticleById, getArticles }