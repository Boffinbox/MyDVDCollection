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
    expect(testSetup.dvd.referenceDVD.title).toEqual(testSetup.title);
    expect(testSetup.dvd.referenceDVD.barcode).toEqual(testSetup.barcode);

    const collRes = await request(app)
        .get(`${api}/disccollections/${testSetup.collId}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
        .send();
    expect(collRes.body.discs[0]).toEqual(testSetup.dvdRes.body);
})

test(`add a dvd without adding a corresponding reference dvd`, async () =>
{
    const testSetup = await userDVDFunctions.testDVDSetup();
    expect(testSetup.dvdRes.status).toBe(201);

    const newDvdRes = await request(app)
        .post(`${api}/disccollections/${testSetup.collId}/userdvds/`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
        .send({ barcode: "7321905737437" });
    expect(newDvdRes.status).toBe(201);
})

test(`update a dvd in a user's collection, setting rating to 2 and watched to true`, async () =>
{
    const testSetup = await userDVDFunctions.testDVDSetup();
    expect(testSetup.dvdRes.status).toBe(201);

    const patchRes = await request(app)
        .patch(`${api}/disccollections/${testSetup.collId}/userdvds/${testSetup.dvd._id}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
        .send({ rating: 2, watched: true });
    expect(patchRes.status).toBe(200);

    const collRes = await request(app)
        .get(`${api}/disccollections/${testSetup.collId}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
        .send();
    expect(collRes.body.discs[0].rating).toEqual(2);
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
    expect(deleteRes.body).toMatchObject({ _id: testSetup.dvd._id });

    const collRes = await request(app)
        .get(`${api}/disccollections/${testSetup.collId}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
        .send();
    expect(collRes.status).toBe(200);
    expect(collRes.body.discs).toEqual([])
})

test(`read a dvd's barcode from only accessing the list of all collections`, async () =>
{
    const testSetup = await userDVDFunctions.testDVDSetup();
    expect(testSetup.dvdRes.status).toBe(201);

    const collRes = await request(app)
        .get(`${api}/disccollections/`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
    expect(collRes.status).toBe(200);
    expect(collRes.body[0].discs[0].referenceDVD.barcode).toEqual("7321905737437")
})