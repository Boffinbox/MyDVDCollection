export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

test(`should return a json with the status message "it worked"`, async () =>
{
    const res = await request(app)
        .get(`${api}/referencedvds/testroute`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("it worked");
})

test(`should return a json with empty data from test db`, async () =>
{
    const res = await request(app)
        .get(`${api}/referencedvds/`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([])
    console.log(res.body);
})

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