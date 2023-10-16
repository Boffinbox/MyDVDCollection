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
    UserModel.register(
        new UserModel({ username, email }),
        password,
        (err, user) =>
        {
            if (err)
            {
                console.log("hitting first error: ", err);
                return res.status(500).json(err);
            }
            else
            {
                const token = getToken({ _id: user._id })
                const refreshToken = getRefreshToken({ _id: user._id })
                user.refreshToken.push({ refreshToken })
                console.log("as far as here")
                user.save()
                    .then((user) =>
                    {
                        console.log("hit success route");
                        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                        res.send({ success: true, token, user })
                    }
                    ).catch((err) =>
                    {
                        console.log("hit failure route");
                        res.status(500).json(err);
                    })
            }
        }
    )
}));


module.exports = router;