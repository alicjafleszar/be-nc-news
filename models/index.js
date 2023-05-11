const { selectTopics } = require("./topics.models");
const { selectArticleById, selectArticles, selectCommentsByArticleId } = require("./articles.models");

module.exports = { selectTopics, selectArticles, selectArticleById, selectCommentsByArticleId }