import { testDVDSetup } from "./helpers/userdvds";
import { loginAUser } from "./helpers/users";

export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

const cookieFunctions = require("./helpers/cookies")
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

test(`try to use the wrong token for a user`, async () =>
{
    // first, setup alice, our honest user, with
    // a new collection, and a copy of gremlins
    const alice = await testDVDSetup("alice", "alice@test.co.uk", "1234", "5678", "gremlins")

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

test(`add two dvds to two collections, then try to delete dvd 1 from collection 2`, async () =>
{
    // first, setup bob, our honest user, with
    // a new collection, and a copy of gremlins
    const bob = await testDVDSetup("bob", "bob@test.co.uk", "1234", "5678", "gremlins")

    // next, make a second collection and add a dvd to that too
    const secondColl = await discCollectionFunctions.newCollection(bob.userToken, "second collection")
    expect(secondColl.status).toBe(201);
    await userDVDFunctions.newDVD(bob.userToken, secondColl.body._id, "5678", "gremlins");

    // should be 1 user, two collections, each with 1 dvd, both called gremlins, same refId, different dvdId.
    const collRes = await request(app)
        .get(`${api}/disccollections`)
        .set(`Authorization`, `Bearer ${bob.userToken}`)
        .send();
    console.log("disc 1 title is: ", collRes.body[0].discs[0].referenceDVD.title);
    console.log("disc 2 title is: ", collRes.body[1].discs[0].referenceDVD.title);
    expect(collRes.body.length).toEqual(2);
    expect(collRes.body[0].discs[0].referenceDVD.title).toEqual(collRes.body[1].discs[0].referenceDVD.title);
    expect(collRes.body[0].discs[0].referenceDVD._id).toEqual(collRes.body[1].discs[0].referenceDVD._id);
    expect(collRes.body[0].discs[0]._id).not.toEqual(collRes.body[1].discs[0]._id)

    // lastly, lets try and delete disc 1 from collection 2
    const deleteRes = await request(app)
        .delete(`${api}/disccollections/${collRes.body[1]._id}/userdvds/${collRes.body[0].discs[0]._id}`)
        .set(`Authorization`, `Bearer ${bob.userToken}`)
        .send();
    expect(deleteRes.status).toBe(401);
})