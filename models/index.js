const { selectTopics, insertTopic } = require("./topics.models");
const { selectArticleById, selectArticles, selectCommentsByArticleId, insertComment, updateArticle, insertArticle, removeArticle } = require("./articles.models");
const { removeComment, updateComment } = require("./comments.models");
const { selectUsers, selectUser } = require("./users.models");

module.exports = { selectTopics, selectArticles, selectArticleById, selectCommentsByArticleId, insertComment, updateArticle, removeComment, selectUsers, selectUser, updateComment, insertArticle, removeArticle, insertTopic };