const passport = require("passport");
const LocalStrategy = require("passport-local")
const { UserModel } = require("../models/models")

// Called during login and signup
passport.use(new LocalStrategy(UserModel.authenticate()));

// Called after login and signup, to set user details at req.user
passport.serializeUser(UserModel.serializeUser());