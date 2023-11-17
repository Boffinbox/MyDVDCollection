export { };

const request = require("supertest");
const app = require("../../app.ts");
const api = "/api/v1"

const userFunctions = require("./users")
const collectionFunctions = require("./disccollections")
const referenceDVDFunctions = require("./referencedvds")

// setup to make a user, make a refdvd, make a collection for that user, then add dvd to user collection
export async function testDVDSetup(
    username: string = "boff",
    email: string = "boff@test.co.uk",
    password: string = "1234",
    title: string = "My Test DVD",
    barcode: string = "5678")
{
    const userDetails = userFunctions.generateUserDetails(username, email, password);
    const registerRes = await userFunctions.registerAUser(userDetails);
    const userToken = registerRes.body.token;

    const refDVDDetails = referenceDVDFunctions.generateReferenceDVDDetails(title, barcode);
    await referenceDVDFunctions.addAReferenceDVD(refDVDDetails)

    const newColl = await collectionFunctions.newCollection(userToken);
    const collId = newColl.body._id;

    const dvdRes = await request(app)
        .post(`${api}/disccollections/${collId}/userdvds/${refDVDDetails.barcode}`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send();
    expect(dvdRes.status).toBe(201);
    expect(dvdRes.body.dvd.referenceDVD.title).toEqual(refDVDDetails.title)
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