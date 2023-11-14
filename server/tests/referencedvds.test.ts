export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

// add defines here
const jwt = require("jsonwebtoken")

// interfaces
interface IReferenceDVDDetails
{
    username: string;
    email: string;
    password: string;
}

function generateReferenceDVDDetails(title = "gremlins", barcode = "0883929003518")
{
    const referenceDVDDetails = { title, barcode };
    return referenceDVDDetails
}

async function addAReferenceDVD(title = "gremlins", barcode = "0883929003518")
{
    const res = await request(app)
        .post(`${api}/referencedvds/`)
        .send({ title, barcode });
    return res;
}
test(`add a reference dvd`, async () =>
{
    const dvdDetails = generateReferenceDVDDetails();
    const res = await addAReferenceDVD();
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(dvdDetails)
})