export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

// add defines here
const jwt = require("jsonwebtoken")
const referenceDVDFunctions = require("./helpers/referencedvds")

test(`add a reference dvd`, async () =>
{
    const dvdDetails = referenceDVDFunctions.generateReferenceDVDDetails();
    const res = await referenceDVDFunctions.addAReferenceDVD(dvdDetails);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(dvdDetails)
})