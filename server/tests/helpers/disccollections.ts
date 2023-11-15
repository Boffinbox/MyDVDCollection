export { }

const request = require("supertest");
const app = require("../../app.ts");
const api = "/api/v1"

export async function newCollection(userToken: string, title: string)
{
    const res = await request(app)
        .post(`${api}/disccollections`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send({ title });
    return res;
}

export async function getCollection(userToken: string, collectionId: string)
{
    const res = await request(app)
        .get(`${api}/disccollections/${collectionId}`)
        .set(`Authorization`, `Bearer ${userToken}`)
        .send();
    return res
}