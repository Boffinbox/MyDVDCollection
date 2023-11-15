export { }

const request = require("supertest");
const app = require("../../app.ts");
const api = "/api/v1"

// interfaces
export interface IReferenceDVDDetails
{
    title: string;
    barcode: string;
}

export function generateReferenceDVDDetails(title = "gremlins", barcode = "0883929003518")
{
    const referenceDVDDetails: IReferenceDVDDetails = { title, barcode };
    return referenceDVDDetails
}

export async function addAReferenceDVD(referenceDVDDetails: IReferenceDVDDetails = generateReferenceDVDDetails())
{
    const res = await request(app)
        .post(`${api}/referencedvds/`)
        .send(referenceDVDDetails);
    return res;
}