const { selectTopics } = require("./topics.models");
const { selectArticleById, selectArticles, selectCommentsByArticleId, insertComment } = require("./articles.models");
const { removeComment } = require("./comments.models")

module.exports = { selectTopics, selectArticles, selectArticleById, selectCommentsByArticleId, insertComment, removeComment }