export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

// add defines here
const userFunctions = require("./helpers/users")
const discCollectionFunctions = require("./helpers/disccollections");

test(`add a collection to a known user`, async () =>
{
    const userDetails = userFunctions.generateUserDetails();
    const registerRes = await userFunctions.registerAUser(userDetails);
    const userToken = registerRes.body.token
    expect(registerRes.status).toBe(201);

    const title = "My Test Collection"
    const res = await discCollectionFunctions.newCollection(userToken, title);
    expect(res.status).toBe(201);
    expect(res.body.title).toEqual(title);
})

test(`retrieve a known collection for a known user`, async () =>
{
    const userDetails = userFunctions.generateUserDetails();
    const registerRes = await userFunctions.registerAUser(userDetails);
    const userToken = registerRes.body.token
    expect(registerRes.status).toBe(201);

    const title = "My Test Collection"
    const resOne = await discCollectionFunctions.newCollection(userToken, title);
    expect(resOne.status).toBe(201);
    expect(resOne.body.title).toEqual(title);

    const collId = resOne.body._id
    const resTwo = await discCollectionFunctions.getCollection(userToken, collId)
    expect(resTwo.status).toBe(200);
    expect(resTwo.body._id).toEqual(collId);
    expect(resTwo.body.title).toEqual(title);
    expect(resTwo.body.discs).toEqual([]);
})

test(`rename a known collection for a known user`, async () =>
{
    const userDetails = userFunctions.generateUserDetails();
    const registerRes = await userFunctions.registerAUser(userDetails);
    const userToken = registerRes.body.token
    expect(registerRes.status).toBe(201);

    const title = "My Test Collection"
    const resOne = await discCollectionFunctions.newCollection(userToken, title);
    expect(resOne.status).toBe(201);
    expect(resOne.body.title).toEqual(title);

    const collId = resOne.body._id
    const getResOne = await discCollectionFunctions.getCollection(userToken, collId)
    expect(getResOne.status).toBe(200);

    const resTwo = await request(app)
        .patch(`${api}/disccollections/${resOne.body._id}`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send({ title: "My Edited Collection" });
    expect(resTwo.status).toBe(200);
    expect(resTwo.body.title).toEqual("My Edited Collection")

    const getResTwo = await discCollectionFunctions.getCollection(userToken, collId)
    expect(getResTwo.status).toBe(200);
    expect(getResTwo.body.title).toEqual("My Edited Collection")
})

test(`delete a known collection for a known user`, async () =>
{
    const userDetails = userFunctions.generateUserDetails();
    const registerRes = await userFunctions.registerAUser(userDetails);
    const userToken = registerRes.body.token
    expect(registerRes.status).toBe(201);

    const title = "My Test Collection"
    const resOne = await discCollectionFunctions.newCollection(userToken, title);
    expect(resOne.status).toBe(201);
    expect(resOne.body.title).toEqual(title);

    const collId = resOne.body._id
    const getResOne = await discCollectionFunctions.getCollection(userToken, collId)
    expect(getResOne.status).toBe(200);

    const resTwo = await request(app)
        .delete(`${api}/disccollections/${resOne.body._id}`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send();
    expect(resTwo.status).toBe(200);

    const getResTwo = await discCollectionFunctions.getCollection(userToken, collId)
    expect(getResTwo.status).toBe(401);
})

test(`retrieve all collections for a known user`, async () =>
{
    const userDetails = userFunctions.generateUserDetails();
    const registerRes = await userFunctions.registerAUser(userDetails);
    const userToken = registerRes.body.token
    expect(registerRes.status).toBe(201);

    // don't use duplicate titles here, we're checking for string match.
    const titles = ["My Zeroth Collection", "My First Collection", "My Second Collection"]
    for (let i = 0; i < titles.length; i++)
    {
        await discCollectionFunctions.newCollection(userToken, titles[i]);
    }

    const res = await request(app)
        .get(`${api}/disccollections`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send();
    console.log(res.body)
    expect(res.body.length).toEqual(titles.length);

    for (let i = 0; i < res.body.length; i++)
    {
        const collRes = await request(app)
            .get(`${api}/disccollections/${res.body[i]}`)
            .set(`Authorization`, `Bearer ${userToken}`)
            .send();
        const coll = collRes.body
        console.log(coll)
        expect(coll.title).toEqual(titles[i]);
    }
})