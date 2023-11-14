const express = require("express")
const router = express.Router()
const passport = require("passport")
const jwt = require("jsonwebtoken")

const { getToken, getRefreshToken, verifyUser, COOKIE_OPTIONS } = require("../auth/authenticate");

import { TryCatchAsync } from "../helpers/TryCatchAsync"
import { UserModel } from "../models"

router.get("/register", TryCatchAsync(async (req, res, next) =>
{
    return res.status(200).json({ message: "it worked" });
}));

router.post("/register", TryCatchAsync(async (req, res, next) =>
{
    const { username, email, password }: { username: string, email: string, password: string } = req.body;
    const newUser = await UserModel.register(new UserModel({ username, email }), password)
    const token = await getToken({ _id: newUser._id, username: newUser.username })
    const refreshToken = await getRefreshToken({ _id: newUser._id, username: newUser.username })
    await newUser.refreshTokens.push({ refreshToken })
    newUser.save().then((user) =>
    {
        return res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS).status(201).json({ success: true, token })
    }
    ).catch((err) =>
    {
        return res.status(500).json(err);
    })
}));

router.post("/login", passport.authenticate("local", { session: false }), TryCatchAsync(async (req, res, next) =>
{
    const { _id } = req.user
    const user = await UserModel.findById({ _id });
    if (!user)
    {
        console.log("hit failure route");
        return res.status(500).json("couldn't find user with that id");
    }
    else
    {
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
}));

router.post("/refreshToken", TryCatchAsync(async (req, res, next) =>
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
}));

router.post("/logout", verifyUser, TryCatchAsync(async (req, res, next) =>
{
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;

    if (!refreshToken)
    {
        return res.status(401).send("Unauthorized");
    }
    const userId = req.user._id
    const user = await UserModel.findById({ _id: userId });
    if (!user)
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
        return res.clearCookie("refreshToken", COOKIE_OPTIONS).send({ success: true })
    }
    ).catch((err) =>
    {
        return res.status(401).send("Unauthorized");
    })
}));

router.get("/me", verifyUser, TryCatchAsync(async (req, res, next) =>
{
    res.send(req.user);
}));


module.exports = router;