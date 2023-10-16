const express = require("express")
const router = express.Router();

const { getToken, getRefreshToken, COOKIE_OPTIONS } = require("../auth/authenticate");

import { TryCatchAsync } from "../helpers/TryCatchAsync"
import { UserModel } from "../models/models"

router.post("/signup", TryCatchAsync(async (req, res, next) =>
{
    const { username, email, password }: { username: string, email: string, password: string } = req.body;
    UserModel.register(
        new UserModel({ email }),
        password,
        (err, user) =>
        {
            if (err)
            {
                return res.status(500).json(err);
            }
            else
            {
                user.email = email
                user.username = username
                const token = getToken({ _id: user._id })
                const refreshToken = getRefreshToken({ _id: user._id })
                user.refreshToken.push({ refreshToken })
                user.save((err, user) =>
                {
                    if (err)
                    {
                        return res.status(500).json(err);
                    }
                    else
                    {
                        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                        res.send({ success: true, token })
                    }
                })
            }
        }
    )
}));


module.exports = router;