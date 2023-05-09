const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const app = require('../app')
const testData = require('../db/data/test-data/')
const request = require('supertest')

beforeEach(() => seed(testData))
afterAll(() => db.end())

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
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    })
                })
        })
    })
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