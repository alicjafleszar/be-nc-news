const { selectTopics } = require("./topics.models");
const { selectArticleById, selectArticles, selectCommentsByArticleId, insertComment, updateArticle } = require("./articles.models");
const { removeComment } = require("./comments.models");
const { selectUsers, selectUser } = require("./users.models");

module.exports = { selectTopics, selectArticles, selectArticleById, selectCommentsByArticleId, insertComment, updateArticle, removeComment, selectUsers, selectUser };