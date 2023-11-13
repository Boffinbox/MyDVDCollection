export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

// add defines here
const jwt = require("jsonwebtoken")

test(`add a user "boff", email "boff@test.co.uk with pass "1234"`, async () =>
{
    const res = await request(app)
        .post(`${api}/users/register`)
        .send(
            {
                username: "boff",
                email: "boff@test.co.uk",
                password: "1234"
            }
        );
    const userResult = jwt.decode(res.body.token);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(userResult.username).toBe("boff");
})

test(`add "boff" again, to check for test db clearance`, async () =>
{
    const res = await request(app)
        .post(`${api}/users/register`)
        .send(
            {
                username: "boff",
                email: "boff@test.co.uk",
                password: "1234"
            }
        );
    const userResult = jwt.decode(res.body.token);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(userResult.username).toBe("boff");
})