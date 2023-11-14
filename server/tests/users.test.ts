export { }

const request = require("supertest");
const app = require("../app.ts");
const api = "/api/v1"

// add defines here
const jwt = require("jsonwebtoken")
const cookieFunctions = require("./helpers/cookies.ts");

// interfaces
interface IUserDetails
{
    username: string;
    email: string;
    password: string;
}

// add functions here
// generate user details, if none provided, returns a "boff" user details
function generateUserDetails(username = "boff", email = "boff@test.co.uk", password = "1234")
{
    const userDetails: IUserDetails = { username, email, password }
    return userDetails
}

async function registerAUser(userDetails: IUserDetails)
{
    const res = await request(app)
        .post(`${api}/users/register`)
        .send(userDetails);
    return res;
}

async function loginAUser(userDetails: IUserDetails)
{
    const res = await request(app)
        .post(`${api}/users/login`)
        .send(userDetails);
    return res;
}

test(`add a user with username, email and password`, async () =>
{
    const userDetails = generateUserDetails();
    const res = await registerAUser(userDetails);
    const userTokenPayload = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(res.status).toBe(201);
    expect(userTokenPayload.username).toEqual(userDetails.username);
});

test(`duplicate test, to check for correct test cleaning`, async () =>
{
    const userDetails = generateUserDetails();
    const res = await registerAUser(userDetails);
    const userTokenPayload = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(res.status).toBe(201);
    expect(userTokenPayload.username).toEqual(userDetails.username);
});

test(`login using a registered user's details`, async () =>
{
    const userDetails = generateUserDetails();
    await registerAUser(userDetails);
    const res = await loginAUser(userDetails);
    const userTokenPayload = jwt.verify(res.body.token, process.env.JWT_SECRET);
    const refreshToken = cookieFunctions.getRefreshTokenFromResponseHeader(res.headers["set-cookie"]);
    const refreshTokenPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    expect(res.status).toBe(200);
    expect(userTokenPayload.username).toEqual(userDetails.username);
    expect(refreshTokenPayload.username).toEqual(userDetails.username);
})

test(`refresh a refresh token and check refresh count has increased`, async () =>
{
    const userDetails = generateUserDetails();
    await registerAUser(userDetails);
    const reqOne = await loginAUser(userDetails);
    const refreshTokenOneCookie = cookieFunctions.getRefreshTokenCookieFromResponseHeader(reqOne.headers["set-cookie"])
    const refreshTokenOne = cookieFunctions.getRefreshTokenFromResponseHeader(reqOne.headers["set-cookie"]);
    const refreshTokenOneDecoded = jwt.verify(refreshTokenOne, process.env.REFRESH_TOKEN_SECRET);
    const reqTwo = await request(app)
        .post(`${api}/users/refreshToken`)
        .set(`Cookie`, [refreshTokenOneCookie])
        .send();
    const refreshTokenTwo = cookieFunctions.getRefreshTokenFromResponseHeader(reqTwo.headers["set-cookie"]);
    const refreshTokenTwoDecoded = jwt.verify(refreshTokenTwo, process.env.REFRESH_TOKEN_SECRET);
    expect(refreshTokenTwoDecoded._id).toEqual(refreshTokenOneDecoded._id);
    expect(refreshTokenTwoDecoded.refreshCount).toBeGreaterThan(refreshTokenOneDecoded.refreshCount);
})

test(`make a user, login, then logout, then try to misuse the invalid refresh token`, async () =>
{
    const userDetails = generateUserDetails();
    await registerAUser(userDetails);
    const reqOne = await loginAUser(userDetails);
    const refreshTokenCookie = cookieFunctions.getRefreshTokenCookieFromResponseHeader(reqOne.headers["set-cookie"])
    const logout = await request(app)
        .post(`${api}/users/logout`)
        .set(`Cookie`, [refreshTokenCookie])
        .set(`Authorization`, `Bearer ${reqOne.body.token}`)
        .send();
    expect(logout.status).toBe(200);
    const reqTwo = await request(app)
        .post(`${api}/users/refreshToken`)
        .set(`Cookie`, [refreshTokenCookie])
        .send();
    expect(reqTwo.status).toBe(401);
})