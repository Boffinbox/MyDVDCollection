const express = require("express")
const router = express.Router()
const passport = require("passport")

const { verifyUser } = require("../auth/authenticate");
const TryCatchAsync = require("../helpers/TryCatchAsync")

const users = require("../controllers/users");

router.post("/register", TryCatchAsync(users.register));

router.post("/login", passport.authenticate("local", { session: false }), TryCatchAsync(users.login));

router.post("/refreshToken", TryCatchAsync(users.refreshToken));

router.post("/logout", verifyUser, TryCatchAsync(users.logout));

module.exports = router;