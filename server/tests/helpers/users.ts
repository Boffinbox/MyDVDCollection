export { };

const request = require("supertest");
const app = require("../../app.ts");
const api = "/api/v1"

// interfaces
export interface IUserDetails
{
    username: string;
    email: string;
    password: string;
}

// add functions here
// generate user details, if none provided, returns a "boff" user details
export function generateUserDetails(username = "boff", email = "boff@test.co.uk", password = "1234")
{
    const userDetails: IUserDetails = { username, email, password }
    return userDetails
}

export async function registerAUser(userDetails: IUserDetails)
{
    const registrationDetails = { ...userDetails, registrationKey: process.env.REGISTRATION_KEY }
    const res = await request(app)
        .post(`${api}/users/register`)
        .send(registrationDetails);
    return res;
}

export async function loginAUser(userDetails: IUserDetails)
{
    const res = await request(app)
        .post(`${api}/users/login`)
        .send(userDetails);
    return res;
}