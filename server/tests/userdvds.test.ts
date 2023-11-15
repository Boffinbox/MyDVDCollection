export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

// add defines here
const userFunctions = require("./helpers/users")
const referenceDVDFunctions = require("./helpers/referencedvds")
const collectionFunctions = require("./helpers/disccollections")

// setup to make a refdvd, make a user, make a collection for that user, then add dvd to user collection
async function testDVDSetup(
    title: string = "My Test DVD",
    barcode: string = "5678",
    username: string = "boff",
    email: string = "boff@test.co.uk",
    password: string = "1234")
{
    const refDVDDetails = referenceDVDFunctions.generateReferenceDVDDetails(title, barcode);
    await referenceDVDFunctions.addAReferenceDVD(refDVDDetails)

    const userDetails = userFunctions.generateUserDetails(username, email, password);
    const registerRes = await userFunctions.registerAUser(userDetails);
    const userToken = registerRes.body.token;

    const newColl = await collectionFunctions.newCollection(userToken);
    const collId = newColl.body._id;

    const dvdRes = await request(app)
        .post(`${api}/disccollections/${collId}/dvds/${refDVDDetails.barcode}`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send();

    const dvd = dvdRes.body.dvd

    return {
        refDVDDetails,
        userDetails,
        userToken,
        collId,
        dvd,
        dvdRes
    }
}

test(`check the basic test dvd setup works correctly`, async () =>
{
    const testSetup = await testDVDSetup();
    expect(testSetup.dvdRes.status).toBe(201);
    expect(testSetup.dvd.referenceDVD.title).toEqual(testSetup.refDVDDetails.title);
    expect(testSetup.dvd.referenceDVD.barcode).toEqual(testSetup.refDVDDetails.barcode);

    const collRes = await request(app)
        .get(`${api}/disccollections/${testSetup.collId}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
        .send();
    expect(collRes.body.discs[0]).toEqual(testSetup.dvdRes.body.dvd);
})

test(`update a dvd in a user's collection, setting rating to 200 and watched to true`, async () =>
{
    const testSetup = await testDVDSetup();
    expect(testSetup.dvdRes.status).toBe(201);

    const patchRes = await request(app)
        .patch(`${api}/disccollections/${testSetup.collId}/dvds/${testSetup.dvd._id}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
        .send({ rating: 200, watched: true });
    expect(patchRes.status).toBe(200);

    const collRes = await request(app)
        .get(`${api}/disccollections/${testSetup.collId}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
        .send();
    expect(collRes.body.discs[0].rating).toEqual(200);
    expect(collRes.body.discs[0].watched).toEqual(true);
})

test(`delete an existing dvd`, async () =>
{
    const testSetup = await testDVDSetup();
    expect(testSetup.dvdRes.status).toBe(201);

    const deleteRes = await request(app)
        .delete(`${api}/disccollections/${testSetup.collId}/dvds/${testSetup.dvd._id}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
        .send();
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toEqual("it worked");

    const collRes = await request(app)
        .get(`${api}/disccollections/${testSetup.collId}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
        .send();
    expect(collRes.status).toBe(200);
    expect(collRes.body.discs).toEqual([])
})