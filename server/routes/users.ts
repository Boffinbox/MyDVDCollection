export { };

const express = require("express")
const router = express.Router()
const passport = require("passport")

const { verifyUser } = require("../auth/authenticate");
const TryCatchAsync = require("../helpers/TryCatchAsync")
const validateLogin = require("../validators/login");
const validateRegistration = require("../validators/registration");
const validateDemo = require("../validators/demo");

const users = require("../controllers/users");

router.post("/register", validateRegistration, TryCatchAsync(users.register));

router.post("/login", validateLogin, passport.authenticate("local", { session: false }), TryCatchAsync(users.login));

router.post("/refreshToken", TryCatchAsync(users.refreshToken));

router.post("/logout", verifyUser, TryCatchAsync(users.logout));

router.post("/demo", validateDemo, TryCatchAsync(users.setDemo))

module.exports = router;