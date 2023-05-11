const { selectTopics } = require("./topics.models");
const { selectArticleById, selectArticles } = require("./articles.models");

module.exports = { selectTopics, selectArticles, selectArticleById }