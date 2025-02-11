const jwt = require("jsonwebtoken")
const { getToken, getRefreshToken, COOKIE_OPTIONS } = require("../auth/authenticate");

const { UserModel } = require("../models")

const getUserDocument = require("../helpers/GetUserDocument");

async function getTokens(user)
{
    const jwt = getToken({ _id: user._id, username: user.username })
    const refreshToken = await getRefreshToken({ _id: user._id, username: user.username, refreshCount: 0 })
    return { jwt, refreshToken };
}

function addNewRefreshTokenToUser(user, refreshToken)
{
    user.refreshTokens.push({ refreshToken, refreshCount: 0 })
    return user;
}

function updateExistingRefreshToken(user, tokenIndex: number)
{
    const newRefreshCount = user.refreshTokens[tokenIndex].refreshCount + 1
    const refreshToken = getRefreshToken({ _id: user._id, username: user.username, refreshCount: newRefreshCount });
    user.refreshTokens[tokenIndex] = { refreshToken, refreshCount: newRefreshCount }
    return { user, refreshToken };
}

export async function register(req, res)
{
    const {
        username,
        email,
        password,
        registrationKey
    }: {
        username: string,
        email: string,
        password: string,
        registrationKey: string
    } = req.body;
    if (registrationKey != process.env.REGISTRATION_KEY)
    {
        return res.status(403).json(`wrong registration key provided ;)`);
    }
    const newUser = await UserModel.register(new UserModel({ username, email }), password)
    const userTokens = await getTokens(newUser);
    const user = addNewRefreshTokenToUser(newUser, userTokens.refreshToken);
    user.save().then((user) =>
    {
        return res.cookie("refreshToken", userTokens.refreshToken, COOKIE_OPTIONS).status(201).json({ success: true, token: userTokens.jwt })
    }
    ).catch((err) =>
    {
        return res.status(500).json(err);
    })
}

export async function login(req, res)
{
    const newUser = await getUserDocument(req, res);
    const userTokens = await getTokens(newUser);
    const user = addNewRefreshTokenToUser(newUser, userTokens.refreshToken);
    user.save().then((user) =>
    {
        return res.cookie("refreshToken", userTokens.refreshToken, COOKIE_OPTIONS).status(200).send({ success: true, token: userTokens.jwt })
    }
    ).catch((err) =>
    {
        return res.status(500).json(err);
    })
}

export async function refreshToken(req, res)
{
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    if (!refreshToken)
    {
        return res.status(401).send("Unauthorized");
    }

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await getUserDocument(req, res, payload._id);

    // check that the provided token from cookies matches one from database
    const tokenIndex = user.refreshTokens.findIndex(
        item => item.refreshToken === refreshToken
    )
    if (tokenIndex === -1)
    {
        return res.status(401).send("Unauthorized");
    }

    const userTokens = await getTokens(user);
    const refreshed = updateExistingRefreshToken(user, tokenIndex)

    refreshed.user.save().then((user) =>
    {
        return res.cookie("refreshToken", refreshed.refreshToken, COOKIE_OPTIONS).send({ success: true, token: userTokens.jwt })
    }
    ).catch((err) =>
    {
        return res.status(401).send("Unauthorized");
    })
}

export async function logout(req, res)
{
    const user = await getUserDocument(req, res);

    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    if (!refreshToken)
    {
        return res.status(401).send("Unauthorized");
    }
    const refreshPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    if (user.username != refreshPayload.username)
    {
        return res.status(401).send("Unauthorized");
    }
    const filteredTokenList = user.refreshTokens.filter((rt) =>
    {
        rt !== refreshToken
    })
    user.refreshTokens = filteredTokenList;
    user.save().then((user) =>
    {
        const deletedCookieOptions = {
            ...COOKIE_OPTIONS,
            // setting maxAge to 0, because technically, you can't actually delete cookies...
            maxAge: 0
        }
        return res.clearCookie("refreshToken", deletedCookieOptions).status(200).send({ success: true })
    }
    ).catch((err) =>
    {
        return res.status(401).send("Unauthorized");
    })
}