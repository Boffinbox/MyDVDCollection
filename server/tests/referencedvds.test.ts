export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

// add defines here
const jwt = require("jsonwebtoken")
const referencedvdFunctions = require("./helpers/referencedvds")

test(`add a reference dvd`, async () =>
{
    const dvdDetails = referencedvdFunctions.generateReferenceDVDDetails();
    const res = await referencedvdFunctions.addAReferenceDVD(dvdDetails);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(dvdDetails)
})