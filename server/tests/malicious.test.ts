import { testDVDSetup } from "./helpers/userdvds";
import { loginAUser } from "./helpers/users";

export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

const cookieFunctions = require("./helpers/cookies")
const userFunctions = require("./helpers/users")
const userDVDFFunctions = require("./helpers/userdvds")

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
    const alice = await testDVDSetup("alice", "alice@test.co.uk", "1234", "gremlins", "5678")

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