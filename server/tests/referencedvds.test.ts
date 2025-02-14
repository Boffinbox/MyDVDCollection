export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

// add defines here
const userDVDFunctions = require("./helpers/userdvds")

test(`get a reference dvd`, async () =>
{
    const testSetup = await userDVDFunctions.testDVDSetup();
    expect(testSetup.dvdRes.status).toBe(201);
    expect(testSetup.dvdRes.body.referenceDVD.barcode).toEqual("7321905737437")
    expect(testSetup.dvdRes.body.referenceDVD.title).toEqual("gremlins")

    const refDvdRes = await request(app)
        .get(`${api}/referencedvds/7321905737437`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
    expect(refDvdRes.status).toBe(200);
    console.log(refDvdRes.body)
    expect(refDvdRes.body.barcode).toEqual("7321905737437")
    expect(refDvdRes.body.title).toEqual("gremlins")
})

test(`update a dvd's name to something different`, async () =>
{
    const testSetup = await userDVDFunctions.testDVDSetup();
    expect(testSetup.dvdRes.status).toBe(201);
    expect(testSetup.dvdRes.body.referenceDVD.barcode).toEqual("7321905737437")
    expect(testSetup.dvdRes.body.referenceDVD.title).toEqual("gremlins")

    const updateRefDvdRes = await request(app)
        .post(`${api}/referencedvds/`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
        .send({ barcode: "7321905737437", title: "pp" });
    expect(updateRefDvdRes.status).toBe(200);
    console.log(updateRefDvdRes.body)
    expect(updateRefDvdRes.body.barcode).toEqual("7321905737437")
    expect(updateRefDvdRes.body.title).toEqual("pp")
})