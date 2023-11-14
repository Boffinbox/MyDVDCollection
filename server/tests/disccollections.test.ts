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
    expect(resTwo.status).toBe(200);
    expect(resOne.body._id).toEqual(resTwo.body._id);
    expect(resOne.body.title).toEqual(resTwo.body.title);
    expect(resTwo.body.discs).toEqual([]);
})

test(`delete a known collection for a known user`, async () =>
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

    const getResOne = await request(app)
        .get(`${api}/disccollections/${resOne.body._id}`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send();
    expect(getResOne.status).toBe(200);

    const resTwo = await request(app)
        .delete(`${api}/disccollections/${resOne.body._id}`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send();
    expect(resTwo.status).toBe(200);

    const getResTwo = await request(app)
        .get(`${api}/disccollections/${resOne.body._id}`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send();
    expect(getResTwo.status).toBe(401);
})

test(`retrieve all collections for a known user`, async () =>
{
    const userDetails = userFunctions.generateUserDetails();
    const registerRes = await userFunctions.registerAUser(userDetails);
    const userToken = registerRes.body.token
    expect(registerRes.status).toBe(201);

    const collOne = await request(app)
        .post(`${api}/disccollections`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send({ title: "My First Collection" });
    expect(collOne.status).toBe(201);
    expect(collOne.body.title).toEqual("My First Collection");

    const collTwo = await request(app)
        .post(`${api}/disccollections`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send({ title: "My Second Collection" });
    expect(collTwo.status).toBe(201);
    expect(collTwo.body.title).toEqual("My Second Collection");

    const collThree = await request(app)
        .post(`${api}/disccollections`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send({ title: "My Third Collection" });
    expect(collThree.status).toBe(201);
    expect(collThree.body.title).toEqual("My Third Collection");

    const res = await request(app)
        .get(`${api}/disccollections`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send();
    expect(res.body.length).toEqual(3);
    expect(res.body[0].title).toEqual("My First Collection");
    expect(res.body[1].title).toEqual("My Second Collection");
    expect(res.body[2].title).toEqual("My Third Collection");
})