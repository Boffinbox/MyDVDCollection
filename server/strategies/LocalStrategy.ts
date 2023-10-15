import passport from "passport"
const UserModel = require("../models/models")
const LocalStrategy = require("passport-local").Strategy

// Called during login and signup
passport.use(new LocalStrategy(UserModel.authenticate()));

// Called after login and signup, to set user details at req.user
passport.serializeUser(UserModel.serializeUser());