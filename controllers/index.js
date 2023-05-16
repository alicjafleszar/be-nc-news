const { getEndpointsInfo } = require("./base.controllers");
const { getTopics } = require("./topics.controllers");
const { getArticleById, getArticles, getCommentsByArticleId, postComment } = require("./articles.controllers");
const { deleteCommentById } = require("./comments.controllers")

module.exports = { getEndpointsInfo, getTopics, getArticleById, getArticles, getCommentsByArticleId, postComment, deleteCommentById }