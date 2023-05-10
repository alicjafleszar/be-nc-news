const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const app = require('../app')
const testData = require('../db/data/test-data/')
const request = require('supertest')

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe('API tests', () => {
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
    /********* Task 3.5 *********/

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
})