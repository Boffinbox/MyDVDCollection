export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

test(`should return a heartbeat json with the status message "i am alive"`, async () =>
{
    const res = await request(app)
        .get(`/heartbeat`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("i am alive");
})

test(`should return a json with empty refdvd data from test db`, async () =>
{
    const res = await request(app)
        .get(`${api}/referencedvds/`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([])
    console.log(res.body);
})