import { StringMap } from "ts-jest";

export { };

const request = require("supertest");
const app = require("../../app.ts");
const api = "/api/v1"

const userFunctions = require("./users")
const collectionFunctions = require("./disccollections")

export async function newDVD(userToken: string, collId: string, barcode: string, title: string)
{
    const dvdRes = await request(app)
        .post(`${api}/disccollections/${collId}/userdvds/`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send({ barcode, title });
    expect(dvdRes.status).toBe(201);
    return dvdRes;
}

// setup to make a user, make a refdvd, make a collection for that user, then add dvd to user collection
export async function testDVDSetup(
    username: string = "boff",
    email: string = "boff@test.co.uk",
    password: string = "1234",
    barcode: string = "7321905737437",
    title: string = "gremlins")
{
    const userDetails = userFunctions.generateUserDetails(username, email, password);
    const registerRes = await userFunctions.registerAUser(userDetails);
    const userToken = registerRes.body.token;

    const newColl = await collectionFunctions.newCollection(userToken);
    const collId = newColl.body._id;

    const dvdRes = await newDVD(userToken, collId, barcode, title)
    expect(dvdRes.status).toBe(201);
    expect(dvdRes.body.dvd.referenceDVD.barcode).toEqual(barcode)
    const dvd = dvdRes.body.dvd

    const returnObject: {
        userDetails: string,
        userToken: string,
        collId: string,
        title: string,
        barcode: string,
        dvd: any,
        dvdRes: any
    } = {
        userDetails,
        userToken,
        collId,
        title,
        barcode,
        dvd,
        dvdRes
    }

    return returnObject
}