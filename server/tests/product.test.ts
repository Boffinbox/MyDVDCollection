if (process.env.NODE_ENV !== "production")
{
    require("dotenv").config();
}

const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app.ts");
const jwt = require("jsonwebtoken")

const api = "/api/v1/"
const testUrl = `mongodb://127.0.0.1:27017/test`

beforeAll(() =>
{
});

describe(`POST ${api}users/register`, () =>
{
    it("should add a new user to the database, name tane, email tane@test.co.uk, pass 1234", async () =>
    {
        const res = await request(app)
            .post(`${api}users/register`)
            .send({
                username: "tane",
                email: "tane@test.co.uk",
                password: "12345"
            })
        expect(res.success).toBe(true);
        expect(res.status).toEqual(200);
        expect(res.token).toBeTruthy();
    });
});

afterAll((done) =>
{
    mongoose.connection.close();
    done()
});

