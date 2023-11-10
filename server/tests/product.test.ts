export { }

const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app.ts");
const jwt = require("jsonwebtoken")

const api = "/api/v1"
const dbUrl = process.env.DB_URL

beforeAll(() =>
{
    mongoose.connect(dbUrl)
        .then(() =>
        {
            console.log(`MongoDB Connection Open :)`);
        })
        .catch((err) =>
        {
            console.log("Oh no! MongoDB Connection Error :(");
            console.log(err);
        });
});

describe(`GET ${api}/referencedvds/testroute`, () =>
{
    it(`should return a json with the status message "it worked"`, async () =>
    {
        const res = await request(app)
            .get(`${api}/referencedvds/testroute`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("it worked");
    })
});

describe(`GET ${api}/referencedvds/`, () =>
{
    it(`should return a json with empty data from test db`, async () =>
    {
        const res = await request(app)
            .get(`${api}/referencedvds/`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual([])
        console.log(res.body);
    })
});

afterAll((done) =>
{
    mongoose.connection.close();
    done()
});

