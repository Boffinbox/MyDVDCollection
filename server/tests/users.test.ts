export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

// add defines here
const jwt = require("jsonwebtoken")
const cookieFunctions = require("./helpers/cookies.ts");

// add functions here

function generateUserDetails(username: string = "boff", email: string = "boff@test.co.uk", password: string = "1234")
{
    return { username, email, password }
}

async function registerAUser(userDetails)
{
    const res = await request(app)
        .post(`${api}/users/register`)
        .send(userDetails);
    return res;
}

test(`add a user with username, email and password`, async () =>
{
    const userDetails = generateUserDetails();
    const res = await registerAUser(userDetails);
    const userResult = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(res.status).toBe(201);
    expect(userResult.username).toBe(userDetails.username);
});

test(`duplicate test, to check for test db dropping correctly`, async () =>
{
    const userDetails = generateUserDetails();
    const res = await registerAUser(userDetails);
    const userResult = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(res.status).toBe(201);
    expect(userResult.username).toBe(userDetails.username);
});

test(`login using a registered user's details`, async () =>
{
    const userDetails = generateUserDetails();
    await registerAUser(userDetails);
    const res = await request(app)
        .post(`${api}/users/login`)
        .send(userDetails);
    const userResult = jwt.verify(res.body.token, process.env.JWT_SECRET);
    const refreshToken = cookieFunctions.getRefreshTokenFromResponseHeader(res.headers["set-cookie"]);
    const refreshResult = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    expect(res.status).toBe(200);
    expect(userResult.username).toBe(userDetails.username);
    expect(refreshResult.username).toBe(userDetails.username);
})

test(`refresh a refresh token and check refresh count has increased`, async () =>
{
    const userDetails = generateUserDetails();
    await registerAUser(userDetails);
    const reqOne = await request(app)
        .post(`${api}/users/login`)
        .send(userDetails);
    const refreshTokenOne = cookieFunctions.getRefreshTokenFromResponseHeader(reqOne.headers["set-cookie"]);
    const refreshTokenOneDecoded = jwt.verify(refreshTokenOne, process.env.REFRESH_TOKEN_SECRET);
    const refreshTokenOneRawCookie = cookieFunctions.getRefreshTokenCookieFromArray(reqOne.headers["set-cookie"])
    const reqTwo = await request(app)
        .post(`${api}/users/refreshToken`)
        .set(`Cookie`, [refreshTokenOneRawCookie])
        .send();
    const refreshTokenTwo = cookieFunctions.getRefreshTokenFromResponseHeader(reqTwo.headers["set-cookie"]);
    const refreshTokenTwoDecoded = jwt.verify(refreshTokenTwo, process.env.REFRESH_TOKEN_SECRET);
    const refreshTokenTwoRawCookie = cookieFunctions.getRefreshTokenCookieFromArray(reqTwo.headers["set-cookie"])
    expect(refreshTokenOneDecoded._id).toEqual(refreshTokenTwoDecoded._id);
    const reqThree = await request(app)
        .post(`${api}/users/refreshToken`)
        .set(`Cookie`, [refreshTokenTwoRawCookie])
        .send();
    const refreshTokenThree = cookieFunctions.getRefreshTokenFromResponseHeader(reqThree.headers["set-cookie"]);
    const refreshTokenThreeDecoded = jwt.verify(refreshTokenThree, process.env.REFRESH_TOKEN_SECRET);
    expect(refreshTokenTwoDecoded.refreshCount).toBeLessThan(refreshTokenThreeDecoded.refreshCount);
})