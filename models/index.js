const { selectTopics } = require("./topics.models");
const { selectArticleById, selectArticles, selectCommentsByArticleId, insertComment, updateArticle } = require("./articles.models");

module.exports = { selectTopics, selectArticles, selectArticleById, selectCommentsByArticleId, insertComment, updateArticle }