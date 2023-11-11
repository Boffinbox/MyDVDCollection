export { }

const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app.ts");
const jwt = require("jsonwebtoken")

const api = "/api/v1"
const dbUrl = `mongodb://127.0.0.1:27017/mDVDcTestBasicDB`

beforeAll(async () =>
{
    await mongoose.connect(dbUrl)
        .then(() =>
        {
            console.log(`MongoDB Test Connection Open :)`);
        })
        .catch((err) =>
        {
            console.log("Oh no! MongoDB Test Connection Error :(");
            console.log(err);
        });
    await mongoose.connection.dropDatabase();
});

describe(`GET ${api}/referencedvds/testroute`, () =>
{
    test(`should return a json with the status message "it worked"`, async () =>
    {
        const res = await request(app)
            .get(`${api}/referencedvds/testroute`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("it worked");
    })
});

describe(`GET ${api}/referencedvds/`, () =>
{
    test(`should return a json with empty data from test db`, async () =>
    {
        const res = await request(app)
            .get(`${api}/referencedvds/`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual([])
        console.log(res.body);
    })
});

describe(`POST ${api}/referencedvds/`, () =>
{
    test(`should add a referencedvd called "gremlins" with barcode "987654321"`, async () =>
    {
        const res = await request(app)
            .post(`${api}/referencedvds/`)
            .send(
                {
                    title: "gremlins",
                    barcode: "987654321"
                }
            );
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({ title: "gremlins", barcode: "987654321" })
    })
});

afterAll(async () =>
{
    await mongoose.connection.close();
});

