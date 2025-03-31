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
    expect(collRes.status).toBe(200)

    const dvdRes = await request(app)
        .get(`${api}/disccollections/${collRes.body._id}/userdvds/${collRes.body.discs[0]}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
        .send();
    expect(dvdRes.status).toBe(200)
    const dvd = dvdRes.body

    const refRes = await request(app)
        .get(`${api}/referencedvds/${dvd.referenceDVD}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
    expect(refRes.status).toBe(200)
    const ref = refRes.body
    dvd.referenceDVD = ref

    console.log(`dvd is:`)
    console.log(dvd)
    console.log(`...and test dvd.body is...`)
    console.log(testSetup.dvd)

    expect(dvd).toMatchObject(testSetup.dvd);
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

test(`add a dvd, and then get that dvd back as json`, async () =>
{
    const testSetup = await userDVDFunctions.testDVDSetup();
    expect(testSetup.dvdRes.status).toBe(201);

    const dvdRes = await request(app)
        .get(`${api}/disccollections/${testSetup.collId}/userdvds/${testSetup.dvd._id}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`);
    expect(dvdRes.status).toBe(200);
    expect(dvdRes.body._id).toBe(testSetup.dvd._id);
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
        .get(`${api}/disccollections/${testSetup.collId}/userdvds/${testSetup.dvd._id}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
        .send();
    expect(collRes.body.rating).toEqual(2);
    expect(collRes.body.watched).toEqual(true);
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

test(`discover a dvd's barcode from scratch`, async () =>
{
    const testSetup = await userDVDFunctions.testDVDSetup();
    expect(testSetup.dvdRes.status).toBe(201);

    const allCollectionsRes = await request(app)
        .get(`${api}/disccollections/`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
    expect(allCollectionsRes.status).toBe(200);
    const allCollections = allCollectionsRes.body

    const collectionRes = await request(app)
        .get(`${api}/disccollections/${allCollections[0]}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
    expect(collectionRes.status).toBe(200);
    const collection = collectionRes.body

    const discRes = await request(app)
        .get(`${api}/disccollections/${collection._id}/userdvds/${collection.discs[0]}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
    expect(discRes.status).toBe(200)
    const disc = discRes.body

    const refRes = await request(app)
        .get(`${api}/referencedvds/${disc.referenceDVD}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
    expect(refRes.status).toBe(200)
    const ref = refRes.body

    expect(ref.barcode).toEqual("7321905737437")
})