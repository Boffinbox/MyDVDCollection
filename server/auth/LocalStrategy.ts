import passport from "passport"
const UserModel = require("../models/models")

// Called during login and signup
passport.use(UserModel.createStrategy());

// Called after login and signup, to set user details at req.user
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());