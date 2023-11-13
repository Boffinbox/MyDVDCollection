export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

// add defines here
const jwt = require("jsonwebtoken")

// add functions here

function generateUserDetails(username: string = "boff", email: string = "boff@test.co.uk", password: string = "1234")
{
    return { username, email, password }
}

function convertCookieStringToObject(cookie: string)
{
    return cookie.split('; ').reduce((prev, current) =>
    {
        const [name, ...value] = current.split('=');
        prev[name] = value.join('=');
        return prev;
    }, {});
}

function getRefreshTokenFromRefreshCookieObject(cookie)
{
    const stringWeCareAbout = cookie.refreshToken;
    const fourSliced = stringWeCareAbout.slice(4);
    const splitString = fourSliced.split(".")
    const theFirstThreeParts = splitString[0] + "." + splitString[1] + "." + splitString[2];
    return theFirstThreeParts;
}

test(`add a user with username, email and password`, async () =>
{
    const userDetails = generateUserDetails();
    const res = await request(app)
        .post(`${api}/users/register`)
        .send(userDetails);
    const userResult = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(res.status).toBe(201);
    expect(userResult.username).toBe(userDetails.username);
});

test(`duplicate test, to check for test db dropping correctly`, async () =>
{
    const userDetails = generateUserDetails();
    const res = await request(app)
        .post(`${api}/users/register`)
        .send(userDetails);
    const userResult = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(res.status).toBe(201);
    expect(userResult.username).toBe(userDetails.username);
});

test(`login using a registered user's details`, async () =>
{
    const userDetails = generateUserDetails();
    await request(app)
        .post(`${api}/users/register`)
        .send(userDetails);
    const res = await request(app)
        .post(`${api}/users/login`)
        .send(userDetails);
    const userResult = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(res.status).toBe(200);
    expect(userResult.username).toBe(userDetails.username);
})