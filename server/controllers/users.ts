const jwt = require("jsonwebtoken")
const { getToken, getRefreshToken, COOKIE_OPTIONS } = require("../auth/authenticate");

const { UserModel } = require("../models")

const getUserDocument = require("../helpers/GetUserDocument");

export async function register(req, res)
{
    const { username, email, password }: { username: string, email: string, password: string } = req.body;
    const newUser = await UserModel.register(new UserModel({ username, email }), password)
    const token = await getToken({ _id: newUser._id, username: newUser.username })
    const refreshToken = await getRefreshToken({ _id: newUser._id, username: newUser.username, refreshCount: 0 })
    await newUser.refreshTokens.push({ refreshToken, refreshCount: 0 })
    newUser.save().then((user) =>
    {
        return res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS).status(201).json({ success: true, token })
    }
    ).catch((err) =>
    {
        return res.status(500).json(err);
    })
}

export async function login(req, res)
{
    const user = await getUserDocument(req, res);
    const token = await getToken({ _id: user._id, username: user.username })
    const refreshToken = await getRefreshToken({ _id: user._id, username: user.username, refreshCount: 0 })
    user.refreshTokens.push({ refreshToken, refreshCount: 0 })
    user.save().then((user) =>
    {
        return res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS).send({ success: true, token })
    }
    ).catch((err) =>
    {
        console.log("hit failure route");
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
    const userId = payload._id;
    const user = await UserModel.findById({ _id: userId });
    if (!user)
    {
        return res.status(401).send("Unauthorized");
    }
    const tokenIndex = user.refreshTokens.findIndex(
        item => item.refreshToken === refreshToken
    )
    if (tokenIndex === -1)
    {
        return res.status(401).send("Unauthorized");
    }
    const newRefreshCount = user.refreshTokens[tokenIndex].refreshCount + 1
    const token = getToken({ _id: userId });
    const newRefreshToken = getRefreshToken({ _id: userId, username: user.username, refreshCount: newRefreshCount });
    user.refreshTokens[tokenIndex] = { refreshToken: newRefreshToken, refreshCount: newRefreshCount }
    user.save().then((user) =>
    {
        return res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS).send({ success: true, token })
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
        return res.clearCookie("refreshToken", COOKIE_OPTIONS).status(200).send({ success: true })
    }
    ).catch((err) =>
    {
        return res.status(401).send("Unauthorized");
    })
}