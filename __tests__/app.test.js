const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const app = require('../app')
const testData = require('../db/data/test-data/')
const request = require('supertest')

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe('GET requests', () => {
    describe('/api', () => {
        describe('GET - status 200 - responds with an array endpoint objects', () => {
            test('responds with an object containing API endpoints as properties holding an object with `description`, `queries`, `bodyFormat` and `exampleResponse` properties', () => {
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
            test('each object in returned array has `slug` and `description` properties', () => {
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
})

describe('Error handling tests', () => {
    describe('/api', () => {
        describe('GET - status 404 - invalid path', () => {
            test('responds with 404 error code and an error message if request was made to invalid route', () => {
                return request(app)
                    .get('/api/notARoute')
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Not Found')
                    })
            })
        })
    })
    describe('/api/articles/:article_id', () => {
        describe('GET - status 404 - id not found', () => {
            test('responds with 404 erroor code and error message if requested article id was not found', () => {
                return request(app)
                    .get('/api/articles/14')
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Article ID Not Found')
                    })
            })
        })
        describe('GET - status 400 - invalid id', () => {
            test('responds with 400 error code and error message if request was invalid', () => {
                return request(app)
                    .get('/api/articles/art3')
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe('Invalid Article ID')
                    })
            })
        })
    })
})