export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

// add defines here
const jwt = require("jsonwebtoken")
const userFunctions = require("./helpers/users")

test(`add a collection to a known user`, async () =>
{
    const userDetails = userFunctions.generateUserDetails();
    const registerRes = await userFunctions.registerAUser(userDetails);
    const userToken = registerRes.body.token
    expect(registerRes.status).toBe(201);

    const res = await request(app)
        .post(`${api}/disccollections`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send({ title: "My Test Collection" });
    expect(res.status).toBe(201);
    expect(res.body.title).toEqual("My Test Collection");
})

test(`retrieve a known collection for a known user`, async () =>
{
    const userDetails = userFunctions.generateUserDetails();
    const registerRes = await userFunctions.registerAUser(userDetails);
    const userToken = registerRes.body.token
    expect(registerRes.status).toBe(201);

    const resOne = await request(app)
        .post(`${api}/disccollections`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send({ title: "My Test Collection" });
    expect(resOne.status).toBe(201);
    expect(resOne.body.title).toEqual("My Test Collection");

    const resTwo = await request(app)
        .get(`${api}/disccollections/${resOne.body._id}`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send();
    expect(resOne.body._id).toEqual(resTwo.body._id);
    expect(resOne.body.title).toEqual(resTwo.body.title);
    expect(resTwo.body.discs).toEqual([]);
})