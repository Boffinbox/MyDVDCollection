const express = require("express")
const router = express.Router()
const passport = require("passport")

const { getToken, getRefreshToken, COOKIE_OPTIONS } = require("../auth/authenticate");

import { TryCatchAsync } from "../helpers/TryCatchAsync"
import { UserModel } from "../models/models"

router.get("/signup", TryCatchAsync(async (req, res, next) =>
{
    return res.status(200).json({ message: "it worked" });
}));

router.post("/signup", TryCatchAsync(async (req, res, next) =>
{
    const { username, email, password }: { username: string, email: string, password: string } = req.body;
    const newUser = await UserModel.register(new UserModel({ username, email }), password)
    const token = await getToken({ _id: newUser._id })
    const refreshToken = await getRefreshToken({ _id: newUser._id })
    await newUser.refreshTokens.push({ refreshToken })
    newUser.save().then((user) =>
    {
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
        res.send({ success: true, token })
    }
    ).catch((err) =>
    {
        res.status(500).json(err);
    })
}));

router.post("/login", passport.authenticate("local", { session: false }), TryCatchAsync(async (req, res, next) =>
{
    const { _id } = req.user
    const token = await getToken({ _id })
    const refreshToken = await getRefreshToken({ _id })
    const user = await UserModel.findById({ _id });
    if (!user)
    {
        console.log("hit failure route");
        res.status(500).json("couldn't find user with that id");
    }
    else
    {
        user.refreshTokens.push({ refreshToken })
        user.save().then((user) =>
        {
            res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
            res.send({ success: true, token })
        }
        ).catch((err) =>
        {
            console.log("hit failure route");
            res.status(500).json(err);
        })
    }
}));


module.exports = router;