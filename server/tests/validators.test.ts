import { testDVDSetup } from "./helpers/userdvds";

export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

const discCollectionFunctions = require("./helpers/disccollections")
const userDVDFunctions = require("./helpers/userdvds")
const userFunctions = require("./helpers/users")

test(`try to register with wrong fields`, async () =>
{
    // register using some absolute garbage values
    // it should be a {email, password, username}.
    const register = await userFunctions.registerAUser({ tane: 1234, plape: "5678", clun: false });
    // this should be a 400 - bad request, because the validation should fail
    // we are checking for a validator failure, not a registration failure
    expect(register.status).toBe(400);
})

test(`try to register with a missing username`, async () =>
{
    // it should be a {email, password, username}.
    // but we're going to skip providing a username
    const register = await userFunctions.registerAUser({ email: "alice@test.co.uk", password: "1234" });
    // this should be a 400 - bad request, because the validation should fail
    expect(register.status).toBe(400);
})

test(`try to login with wrong user fields`, async () =>
{
    // login using some absolute garbage values
    // it should be a {email, password, username} where username is optional.
    const login = await userFunctions.loginAUser({ tane: 1234, plape: "5678", clun: false });
    // this should be a 400 - bad request, because the validation should fail
    // we are checking for a validator failure, not a login failure
    expect(login.status).toBe(400);
})

test(`make a user, then make a disccollection with no title`, async () =>
{
    // make one user, trudy
    const trudyDetails = userFunctions.generateUserDetails("trudy", "mal@icio.us", "hahaha");
    // trudy saves her access token while registering, to use for evil deeds later
    const trudyToken = await userFunctions.registerAUser(trudyDetails).then((res) => res.body.token)

    // now, lets try to make a new disc collection with a blank title
    // so that maybe a blank title breaks the database? >:)
    const trudyRes = await request(app)
        .post(`${api}/disccollections/`)
        .set(`Authorization`, `Bearer ${trudyToken}`)
        .send({});
    expect(trudyRes.status).toBe(400);
})

test(`make a user, then make a disccollection with a really really long title`, async () =>
{
    // make one user, trudy
    const trudyDetails = userFunctions.generateUserDetails("trudy", "mal@icio.us", "hahaha");
    // trudy saves her access token while registering, to use for evil deeds later
    const trudyToken = await userFunctions.registerAUser(trudyDetails).then((res) => res.body.token)

    // now, lets get a classic greentext
    const greentext = `The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be completed each time you hear this sound. [ding] Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start.`

    // now, trudy is going to try and make a new disc collection
    // using this greentext as the title. if trudy can do this,
    // then she can perhaps overflow and get data back?
    const trudyRes = await request(app)
        .post(`${api}/disccollections/`)
        .set(`Authorization`, `Bearer ${trudyToken}`)
        .send({ title: greentext });
    // we are expecting the title to max out at 64 characters.
    expect(trudyRes.status).toBe(400);
})

test(`make a user, then get a collection with wrong length`, async () =>
{
    // make one user, trudy
    const trudyDetails = userFunctions.generateUserDetails("trudy", "mal@icio.us", "hahaha");
    // trudy saves her access token while registering, to use for evil deeds later
    const trudyToken = await userFunctions.registerAUser(trudyDetails).then((res) => res.body.token)

    // set an obviously incorrect hex as our coll id
    const randomHex =
        `6fefd5247698608f482de122fe053391
    4ddf08d8d07080b2cb61a3f47e245fe3
    3b566dae05e223f1954351bcb921225f
    ea9525d52838854f4c92cda4f74f170a
    80a6d1083f80aca010649f8d883ef0d4`

    // now try to get a collection using an Id of an obviously incorrect number
    const collRes = await discCollectionFunctions.getCollection(trudyToken, randomHex)
    // we are looking for a validator error of 400, not a 404
    // the difference is that a 400 should be received
    // when an invalid hex id is provided
    // i.e, not 24 digits in length
    expect(collRes.status).toBe(400);

    // just to be sure, now try a correct length and expect a 401 ""unauthorised""
    const collResTwo = await discCollectionFunctions.getCollection(trudyToken, `123412341234123412341234`)
    expect(collResTwo.status).toBe(401);
})

test(`try to use an obviously wrong collID when reading a dvd`, async () =>
{
    // first, setup alice, our honest user, with
    // a new collection, and a copy of gremlins
    const alice = await testDVDSetup("alice", "alice@test.co.uk", "1234", "567856785678", "gremlins")

    // now, lets try to actively access a wrong collection name and delete a dvd
    const wrongRes = await request(app)
        .delete(`${api}/disccollections/tanetonite/userdvds/${alice.dvd._id}`)
        .set(`Authorization`, `Bearer ${alice.userToken}`)
        .send();
    // we are expecting "tanetonite" to be invalid as is it 10 characers
    // the validator is looking for 24 exactly
    expect(wrongRes.status).toBe(400);

    // and just to be sure, lets now honestly delete the dvd as alice
    const aliceRes = await request(app)
        .delete(`${api}/disccollections/${alice.collId}/userdvds/${alice.dvd._id}`)
        .set(`Authorization`, `Bearer ${alice.userToken}`)
        .send();
    expect(aliceRes.status).toBe(200);
})

test(`try to use an obviously wrong discID when reading a dvd`, async () =>
{
    // first, setup alice, our honest user, with
    // a new collection, and a copy of gremlins
    const alice = await testDVDSetup("alice", "alice@test.co.uk", "1234", "567856785678", "gremlins")

    // now, lets try to actively access a wrong collection name and delete a dvd
    const wrongRes = await request(app)
        .delete(`${api}/disccollections/${alice.collId}/userdvds/tanetonite`)
        .set(`Authorization`, `Bearer ${alice.userToken}`)
        .send();
    // we are expecting "tanetonite" to be invalid as is it 10 characers
    // the validator is looking for 24 exactly
    expect(wrongRes.status).toBe(400);

    // and just to be sure, lets now honestly delete the dvd as alice
    const aliceRes = await request(app)
        .delete(`${api}/disccollections/${alice.collId}/userdvds/${alice.dvd._id}`)
        .set(`Authorization`, `Bearer ${alice.userToken}`)
        .send();
    expect(aliceRes.status).toBe(200);
})

test(`try to create a dvd with obviously wrong barcode`, async () =>
{
    // make one user, bob
    const bobDetails = userFunctions.generateUserDetails("bob", "bob@test.co.uk", "1234");
    const bobToken = await userFunctions.registerAUser(bobDetails).then((res) => res.body.token)
    const collRes = await discCollectionFunctions.newCollection(bobToken, "my coll");
    const newDVDRes = await userDVDFunctions.newDVD(bobToken, collRes.body._id, "tane")
    // expecting a 400 - barcode shorter than 12 digits
    // also, the barcode is set to "tane", it's not even a number...
    expect(newDVDRes.status).toBe(400);
})

test(`attempt update of a dvd in a user's collection, setting rating to 20000`, async () =>
{
    const testSetup = await userDVDFunctions.testDVDSetup();
    expect(testSetup.dvdRes.status).toBe(201);

    const patchRes = await request(app)
        .patch(`${api}/disccollections/${testSetup.collId}/userdvds/${testSetup.dvd._id}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
        .send({ rating: 20000, watched: true });
    expect(patchRes.status).toBe(400);
})