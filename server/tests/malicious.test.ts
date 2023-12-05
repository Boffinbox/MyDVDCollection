import { testDVDSetup } from "./helpers/userdvds";

export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

const discCollectionFunctions = require("./helpers/disccollections")
const userFunctions = require("./helpers/users")
const userDVDFunctions = require("./helpers/userdvds")

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