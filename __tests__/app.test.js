const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const app = require('../app')
const testData = require('../db/data/test-data/')
const request = require('supertest')
require('jest-sorted');

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe('GET requests', () => {
    describe('/api', () => {
        describe('GET - status 200 - responds with an array endpoint objects', () => {
            test('responds with an object containing API endpoints as properties holding an object with "description", "queries", "bodyFormat" and "exampleResponse" properties', () => {
                return request(app)
                    .get('/api')
                    .expect(200)
                    .then(({ body: { endpoints } }) => {
                        Object.entries(endpoints).forEach(endpoint => {
                            endpoint[0] = expect.any(String)
                            expect(endpoint[1]).toMatchObject(
                                expect.objectContaining({
                                "description": expect.any(String),
                                "queries": expect.any(Array),
                                "bodyFormat": expect.any(Object),
                                "exampleResponse": expect.any(Object)
                                })
                            )
                        })
                        expect(Object.keys(endpoints)).toHaveLength(3)
                    })
            })
        })
    })
    describe('/api/topics', () => {
        describe('GET - status 200 - responds with an array of topic objects', () => {
            test('responds with an array of objects', () => {
                return request(app)
                    .get('/api/topics')
                    .expect(200)
                    .then(({ body: { topics } }) => {
                        expect(topics).toHaveLength(3)
                        topics.forEach(topic => expect(typeof topic).toBe('object'))
                    })
            })
            test('each object in returned array has "slug" and "description" properties', () => {
                return request(app)
                    .get('/api/topics')
                    .expect(200)
                    .then(({ body: { topics } }) => {
                        topics.forEach(topic => {
                            expect(topic).toMatchObject(
                                expect.objectContaining({
                                    slug: expect.any(String),
                                    description: expect.any(String)
                                })
                            )
                        })
                    })
            })
        })
    })
    describe('/api/articles', () => {
        describe('GET - status 200 - responds with an array of article objects', () => {
            test('responds with an array of objects, each of them containing "author", "title", "article_id", "topic", "created_at", "votes", "article_img_url" and "comment_count" but not including "body" property', () => {
                return request(app)
                    .get('/api/articles')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toHaveLength(12)
                        articles.forEach(article => {
                            expect(article).toMatchObject(
                                expect.objectContaining({
                                    "article_id": expect.any(Number),
                                    "author": expect.any(String),
                                    "title": expect.any(String),
                                    "topic": expect.any(String),
                                    "created_at": expect.any(String),
                                    "votes": expect.any(Number),
                                    "article_img_url": expect.any(String),
                                    "comment_count": expect.any(Number)
                                })
                            )
                            expect(article).not.toHaveProperty('body')
                        })
                    })
            })
        })
        describe('GET - status 200 - accepts queries', () => {
            test('sorts articles by date in descending order by default', () => {
                return request(app)
                    .get('/api/articles/')
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSorted({
                            key: 'created_at',
                            descending: true
                        })
                    })
            })
        })
    })
    describe('/api/articles/:article_id', () => {
        describe('GET - status 200 - responds with a single object', () => {
            test('responds with an object with article_id matching requested id parameter', () => {
                return request(app)
                    .get('/api/articles/1')
                    .expect(200)
                    .then(({ body: { article } }) => {
                        expect(article).toHaveProperty('article_id', 1)
                        expect(article).toHaveProperty('title', 'Living in the shadow of a great man')
                        expect(article).toHaveProperty('topic', 'mitch')
                        expect(article).toHaveProperty('author', 'butter_bridge')
                        expect(article).toHaveProperty('body', 'I find this existence challenging')
                        expect(article).toHaveProperty('created_at', expect.any(String))
                        expect(article).toHaveProperty('votes', 100)
                        expect(article).toHaveProperty('article_img_url', 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
                    })
            })
        })
    })
    describe('/api/articles/:article_id/comments', () => {
        describe('GET - status 200 - responds with an array of comment objects', () => {
            test('responds with an array of comments for the given article_id of which each comment should have "comment_id", "votes", "created_at", "author", "body" and "article_id" properties', () => {
                return request(app)
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then(({ body: { comments } }) => {
                        expect(comments).toHaveLength(11)
                        comments.forEach(comment => {
                            expect(comment).toMatchObject(
                                expect.objectContaining({
                                    comment_id: expect.any(Number),
                                    votes: expect.any(Number),
                                    created_at: expect.any(String),
                                    author: expect.any(String),
                                    body: expect.any(String),
                                    article_id: expect.any(Number)
                                })
                            )
                        })
                    })
            })
            test('responds with an empty array if there is no comments referencing valid article', () => {
                return request(app)
                    .get('/api/articles/2/comments')
                    .expect(200)
                    .then(({ body: { comments } }) => {
                        expect(comments).toEqual([])
                    })
            })
            test('responds with an array that is sorted by creation date in descending order', () => {
                return request(app)
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then(({ body: { comments } }) => {
                        expect(comments).toBeSorted({
                            key: 'created_at',
                            descending: true
                        })
                    })
            })
        })
    })
})

describe('POST requests', () =>{
    describe('/api/articles/:article_id/comments', () => {
        describe('POST - status 201 - responds with added comment', () => {
            test('responds with a posted comment if request body is provided an object with username and body properties', () => {
                const newComment = {
                    "username": "lurker",
                    "body": "cool article"
                }
                return request(app)
                    .post('/api/articles/5/comments')
                    .send(newComment)
                    .expect(201)
                    .then(({ body: { comment } }) => {
                        expect(comment).toMatchObject(expect.objectContaining({
                            comment_id: 19,
                            body: "cool article",
                            votes: 0,
                            author: "lurker",
                            article_id: 5,
                            created_at: expect.any(String)
                        }))
                    })
            })
            test('ignores unnecessary properties on request body object', () => {
                const newComment = {
                    "username": "lurker",
                    "body": "cool article",
                    "votes": 300
                }
                return request(app)
                    .post('/api/articles/5/comments')
                    .send(newComment)
                    .expect(201)
                    .then(({ body: { comment } }) => {
                        expect(comment).toMatchObject(expect.objectContaining({
                            comment_id: 19,
                            body: "cool article",
                            votes: 0,
                            author: "lurker",
                            article_id: 5,
                            created_at: expect.any(String)
                        }))
                    })
            })
            test('adds a new comment to comments table', () => {
                const newComment = {
                    "username": "lurker",
                    "body": "cool article"
                }
                return request(app)
                    .post('/api/articles/5/comments')
                    .send(newComment)
                    .expect(201)
                    .then(({ body: { comment } }) => {
                        return request(app)
                            .get('/api/articles/5/comments')
                            .expect(200)
                            .then(({ body: { comments } }) => {
                                expect(comments).toEqual(
                                    expect.arrayContaining([
                                        comment
                                    ])
                                )
                        })
                })
            })
        })
    })
})

describe('DELETE requests', () => {
    describe('/api/comments/:comment_id', () => {
        describe('DELETE - status 204 - No Content', () => {
            test('deletes a comment with the given comment ID', () => {
                return request(app)
                    .delete('/api/comments/5')
                    .expect(204)
                    .then(() => {
                        return request(app)
                            .get('/api/comments/5')
                            .expect(404)
                            .then(({ body: { msg } }) => {
                                expect(msg).toBe('Not Found')
                            })
                    })
            })
            test('responds with status 204 and "No Content" message', () => {
                return request(app)
                    .delete('/api/comments/5')
                    .expect(204)
                    .then(({ res: { statusMessage } }) => {
                        expect(statusMessage).toBe('No Content')
                    })
            })
        })
    })
})

describe('Error handling tests', () => {
    describe('/*', () => {
        describe('GET - status 404 - invalid path', () => {
            test('/api/notARoute - responds with 404 error code and an error message if request was made to invalid route', () => {
                return request(app)
                    .get('/api/notARoute')
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Not Found')
                    })
            })
            test('/api/articles/:article_id/notARoute - responds with 404 error code and an error message if request was made to invalid route', () => {
                return request(app)
                    .get('/api/articles/:article_id/notARoute')
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Not Found')
                    })
            })
        })
    })
    describe('/api/articles/:article_id/*', () => {
        describe('Status 404 - article ID not found', () => {
            test('GET - / - responds with 404 erroor code and error message if requested article id was not found', () => {
                return request(app)
                    .get('/api/articles/204')
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Not Found')
                    })
            })
            test('GET - /comments - responds with 404 erroor code and error message if requested article ID was not found', () => {
                return request(app)
                    .get('/api/articles/16/comments')
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Not Found')
                    })
            })
            test('POST - /comments - responds with 404 error code and error message if requested article ID was not found', () => {
                return request(app)
                    .post('/api/articles/120/comments')
                    .send({
                        "username": "lurker",
                        "body": "cool article"
                    })
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Not Found')
                    })
            })
        })
        describe('Status 400 - invalid article ID', () => {
            test('GET - / - responds with 400 error code and error message if request was invalid', () => {
                return request(app)
                    .get('/api/articles/art3')
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Invalid Request')
                    })
            })
            test('GET - /comments - responds responds with 400 error code and error message if requested article ID was invalid', () => {
                return request(app)
                    .get('/api/articles/art3/comments')
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Invalid Request')
                    })
            })
            test('POST - /comments - responds responds with 400 error code and error message if requested article ID was invalid', () => {
                return request(app)
                    .post('/api/articles/art5/comments')
                    .send({
                        "username": "lurker",
                        "body": "cool article"
                    })
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Invalid Request')
                    })
            })
        })
    })
    describe('/api/articles/:article_id/comments', () => {
        describe('POST - status 400 - invalid request body', () => {
            test('responds with 400 erroor code and error message if provided body of the request does not contain username and/or body property value', () => {
                return request(app)
                    .post('/api/articles/3/comments')
                    .send({
                        "username": "lurker",
                        "body": null
                    })
                    .expect(400)
                    .then(({ body: { msg: noBodyMsg } }) => {
                        return request(app)
                            .post('/api/articles/3/comments')
                            .send({
                                "username": null,
                                "body": "cool article"
                            })
                            .expect(400)
                            .then(({ body: { msg: noUserMsg } }) => {
                                expect(noBodyMsg).toBe('Invalid Request')
                                expect(noUserMsg).toBe('Invalid Request')
                            })
                    })
            })
            test('responds with 404 error code and error message if provided username does not exists', () => {
                return request(app)
                    .post('/api/articles/3/comments')
                    .send({
                        "username": "deletedAccount",
                        "body": "cool article"
                    })
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Not Found')
                    })
            })
        })
    })
    describe('/api/comments/:comment_id', () => {
        describe('DELETE - status 404 - not found', () => {
            test('responds with 404 erroor code and error message if requested comment ID was not found', () => {
                return request(app)
                    .delete('/api/comments/50')
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Not Found')
                    })
            })
        })
        describe('DELETE - status 400 - invalid comment ID', () => {
            xtest('responds responds with 400 error code and error message if requested comment ID was invalid', () => {
                return request(app)
                    .delete('/api/comments/comment3')
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Invalid Request')
                    })
            })
        })
    })
})