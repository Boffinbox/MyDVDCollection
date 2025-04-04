export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

// add defines here
const userDVDFunctions = require("./helpers/userdvds")
const discCollectionFunctions = require("./helpers/disccollections");

test(`get a reference dvd`, async () =>
{
    const testSetup = await userDVDFunctions.testDVDSetup();
    expect(testSetup.dvdRes.status).toBe(201);
    expect(testSetup.dvdRes.body.referenceDVD.barcode).toEqual("7321905737437")
    expect(testSetup.dvdRes.body.referenceDVD.title).toEqual("gremlins")

    const refId = testSetup.dvdRes.body.referenceDVD._id

    const refDvdRes = await request(app)
        .get(`${api}/referencedvds/${refId}`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
    expect(refDvdRes.status).toBe(200);
    console.log(refDvdRes.body)
    expect(refDvdRes.body._id).toEqual(refId)
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

test(`get barcodes object`, async () =>
{
    const testSetup = await userDVDFunctions.testDVDSetup();
    expect(testSetup.dvdRes.status).toBe(201);
    expect(testSetup.dvdRes.body.referenceDVD.barcode).toEqual("7321905737437")
    expect(testSetup.dvdRes.body.referenceDVD.title).toEqual("gremlins")

    const title = "My Second Collection"
    const res = await discCollectionFunctions.newCollection(testSetup.userToken, title);
    expect(res.status).toBe(201);
    expect(res.body.title).toEqual(title);

    const collIdOne = testSetup.collId
    const collIdTwo = res.body._id

    console.log(collIdOne)
    console.log(collIdTwo)

    const disc1 = await userDVDFunctions.newDVD(
        testSetup.userToken,
        collIdOne,
        "123456",
        "test dvd one"
    )
    const disc2 = await userDVDFunctions.newDVD(
        testSetup.userToken,
        collIdOne,
        "123456",
        "test dvd pne"
    )
    const disc3 = await userDVDFunctions.newDVD(
        testSetup.userToken,
        collIdTwo,
        "123456",
        "test dvd one"
    )
    const disc4 = await userDVDFunctions.newDVD(
        testSetup.userToken,
        collIdOne,
        "234567",
        "test dvd two"
    )
    const disc5 = await userDVDFunctions.newDVD(
        testSetup.userToken,
        collIdOne,
        "234567",
        "test dvd two"
    )
    const disc6 = await userDVDFunctions.newDVD(
        testSetup.userToken,
        collIdOne,
        "345678",
        "test dvd three"
    )

    const barcodeRes = await request(app)
        .get(`${api}/referencedvds/barcodes`)
        .set(`Authorization`, `Bearer ${testSetup.userToken}`)
    const data = barcodeRes.body
    expect(data["123456"].count).toEqual(3)
    expect(data["234567"].count).toEqual(2)
    expect(data["345678"].count).toEqual(1)
    expect(data["7321905737437"].count).toEqual(1)
    expect(data["123456"].collArray.length).toEqual(2)
    expect(data["7321905737437"].collArray.length).toEqual(1)
    expect(data["123456"].collArray.indexOf(collIdOne)).toBeGreaterThan(-1)
    expect(data["123456"].collArray.indexOf(collIdTwo)).toBeGreaterThan(-1)
})