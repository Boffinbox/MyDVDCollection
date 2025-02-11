import { testDVDSetup } from "./helpers/userdvds";

export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

const discCollectionFunctions = require("./helpers/disccollections")
const userFunctions = require("./helpers/users")
const userDVDFunctions = require("./helpers/userdvds")

test(`try to login with wrong email`, async () =>
{
    // make one user, alice
    const userDetails = userFunctions.generateUserDetails("alice", "alice@test.co.uk", "1234");
    await userFunctions.registerAUser(userDetails);
    // attempt to login as alice, but using bob's email
    const login = await userFunctions.loginAUser({ ...userDetails, email: "bob@test.co.uk" });
    expect(login.status).toBe(401);
})

test(`try to login with wrong password`, async () =>
{
    // make one user, alice
    const userDetails = userFunctions.generateUserDetails("alice", "alice@test.co.uk", "1234");
    await userFunctions.registerAUser(userDetails);
    // attempt to login as alice, but using a wrong password
    const login = await userFunctions.loginAUser({ ...userDetails, password: "5678" });
    expect(login.status).toBe(401);
})

test(`make a user, then make a disccollection with HTML in it's title`, async () =>
{
    // make one user, trudy
    const trudyDetails = userFunctions.generateUserDetails("trudy", "mal@icio.us", "hahaha");
    // trudy saves her access token while registering, to use for evil deeds later
    const trudyToken = await userFunctions.registerAUser(trudyDetails).then((res) => res.body.token)

    // now, lets try to make a new disc collection with HTML in the title
    // if trudy can do this, then she can inject <script> tags into the db. muhahaha!
    const trudyRes = await request(app)
        .post(`${api}/disccollections/`)
        .set(`Authorization`, `Bearer ${trudyToken}`)
        .send({ title: "<script>alert(‘ha! 'tis i, trudy!’)</script>" });
    expect(trudyRes.status).toBe(400);
})

test(`try to use the wrong jwt token for a user`, async () =>
{
    // first, setup alice, our honest user, with
    // a new collection, and a copy of gremlins
    const alice = await testDVDSetup("alice", "alice@test.co.uk", "1234", "567856785678", "gremlins")

    // next, setup trudy the intruder
    const trudyDetails = userFunctions.generateUserDetails("trudy", "mal@icio.us", "hahaha")
    // trudy saves her access token while registering, to use for evil deeds later
    const trudyToken = await userFunctions.registerAUser(trudyDetails).then((res) => res.body.token)

    // now, lets try to delete alice's copy of gremlins, using trudy's token. mwuhahaha
    const trudyRes = await request(app)
        .delete(`${api}/disccollections/${alice.collId}/userdvds/${alice.dvd._id}`)
        .set(`Authorization`, `Bearer ${trudyToken}`)
        .send();
    expect(trudyRes.status).toBe(401);

    // and just to be sure, lets now honestly delete the dvd as alice
    const aliceRes = await request(app)
        .delete(`${api}/disccollections/${alice.collId}/userdvds/${alice.dvd._id}`)
        .set(`Authorization`, `Bearer ${alice.userToken}`)
        .send();
    expect(aliceRes.status).toBe(200);
})

test(`try to rename another user's collection to something else`, async () =>
{
    // first, setup alice, our honest user, with
    // a new collection, and a copy of gremlins
    const alice = await testDVDSetup("alice", "alice@test.co.uk", "1234", "567856785678", "gremlins")

    // next, setup trudy the intruder
    const trudyDetails = userFunctions.generateUserDetails("trudy", "mal@icio.us", "hahaha")
    // trudy saves her access token while registering, to use for evil deeds later
    const trudyToken = await userFunctions.registerAUser(trudyDetails).then((res) => res.body.token)

    // now, lets try to rename one of alice's collections, using trudy's token. alice's collection should be "My Test Collection"
    const trudyRes = await request(app)
        .patch(`${api}/disccollections/${alice.collId}/`)
        .set(`Authorization`, `Bearer ${trudyToken}`)
        .send({ title: "My Evil Collection" });
    expect(trudyRes.status).toBe(401);

    // and just to be sure, lets now re-read alice's legitimate collection title
    const aliceRes = await request(app)
        .get(`${api}/disccollections/${alice.collId}/`)
        .set(`Authorization`, `Bearer ${alice.userToken}`)
        .send();
    expect(aliceRes.status).toBe(200);
    expect(aliceRes.body.title).toEqual("My Test Collection")
})

test(`add two dvds to two collections, then try to delete dvd 1 from collection 2`, async () =>
{
    // first, setup bob, our honest user, with
    // a new collection, and a copy of gremlins
    const bob = await testDVDSetup("bob", "bob@test.co.uk", "1234", "567856785678", "gremlins")

    // get the first coll as separate data
    const firstColl = await discCollectionFunctions.getCollection(bob.userToken, bob.collId)
    expect(firstColl.status).toBe(200)

    // then, make a second collection and add a dvd to that too
    const newColl = await discCollectionFunctions.newCollection(bob.userToken, "second collection")
    expect(newColl.status).toBe(201);
    await userDVDFunctions.newDVD(bob.userToken, newColl.body._id, "567856785678", "gremlins");
    const secondColl = await discCollectionFunctions.getCollection(bob.userToken, newColl.body._id)
    expect(secondColl.status).toBe(200)

    // should be 1 user, two collections, each with 1 dvd, both called gremlins, same refId, different dvdId.
    const collRes = await request(app)
        .get(`${api}/disccollections`)
        .set(`Authorization`, `Bearer ${bob.userToken}`)
        .send();
    console.log("disc 1 title is: ", firstColl.body.discs[0].referenceDVD.title);
    console.log("disc 2 title is: ", secondColl.body.discs[0].referenceDVD.title);
    expect(collRes.body.length).toEqual(2);
    expect(firstColl.body.discs[0].referenceDVD.title).toEqual(secondColl.body.discs[0].referenceDVD.title);
    expect(firstColl.body.discs[0].referenceDVD._id).toEqual(secondColl.body.discs[0].referenceDVD._id);
    expect(firstColl.body.discs[0]._id).not.toEqual(secondColl.body.discs[0]._id)

    // lastly, lets try and delete disc 1 from collection 2
    const deleteRes = await request(app)
        .delete(`${api}/disccollections/${secondColl.body._id}/userdvds/${firstColl.body.discs[0]._id}`)
        .set(`Authorization`, `Bearer ${bob.userToken}`)
        .send();
    expect(deleteRes.status).toBe(401);
})