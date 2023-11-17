export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

// add defines here
const userDVDFunctions = require("./helpers/userdvds")

test(`check the basic test dvd setup works correctly`, async () =>
{
    const testSetup = await userDVDFunctions.testDVDSetup();
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
    const testSetup = await userDVDFunctions.testDVDSetup();
    expect(testSetup.dvdRes.status).toBe(201);

    const patchRes = await request(app)
        .patch(`${api}/disccollections/${testSetup.collId}/userdvds/${testSetup.dvd._id}`)
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
    const testSetup = await userDVDFunctions.testDVDSetup();
    expect(testSetup.dvdRes.status).toBe(201);

    const deleteRes = await request(app)
        .delete(`${api}/disccollections/${testSetup.collId}/userdvds/${testSetup.dvd._id}`)
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