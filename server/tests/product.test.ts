if (process.env.NODE_ENV !== "production")
{
    require("dotenv").config();
}

const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app.ts");
const jwt = require("jsonwebtoken")

const api = "/api/v1"
const testUrl = `mongodb://127.0.0.1:27017/test`

beforeAll(() =>
{
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

afterAll((done) =>
{
    mongoose.connection.close();
    done()
});

