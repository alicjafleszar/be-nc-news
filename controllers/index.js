const { getEndpointsInfo } = require("./base.controllers");
const { getTopics } = require("./topics.controllers");
const { getArticleById, getArticles, getCommentsByArticleId, postComment, patchArticle, postArticle } = require("./articles.controllers");
const { deleteCommentById, patchCommentById } = require("./comments.controllers");
const { getUsers, getUser } = require("./users.controllers")

module.exports = { getEndpointsInfo, getTopics, getArticleById, getArticles, getCommentsByArticleId, postComment, patchArticle, deleteCommentById, getUsers, getUser, patchCommentById, postArticle };