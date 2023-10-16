const express = require("express")
const router = express.Router();

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
    await newUser.refreshToken.push({ refreshToken })
    console.log("as far as here")
    newUser.save()
        .then((user) =>
        {
            console.log("hit success route");
            res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
            res.send({ success: true, token, user })
            console.log("sent token was: " + token)
        }
        ).catch((err) =>
        {
            console.log("hit failure route");
            res.status(500).json(err);
        })
}));


module.exports = router;