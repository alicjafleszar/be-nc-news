const { getEndpointsInfo } = require("./base.controllers");
const { getTopics } = require("./topics.controllers");
const { getArticleById, getArticles, getCommentsByArticleId, postComment, patchArticle } = require("./articles.controllers");
const { deleteCommentById } = require("./comments.controllers");
const { getUsers } = require("./users.controllers")

module.exports = { getEndpointsInfo, getTopics, getArticleById, getArticles, getCommentsByArticleId, postComment, patchArticle, deleteCommentById, getUsers };