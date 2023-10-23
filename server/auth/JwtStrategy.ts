import passport from "passport"
import { UserModel } from "../models/models"

const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(
    new JwtStrategy(opts, function (jwt_payload, done)
    {
        // Check that the jwt provided includes a user id,
        // which must be a valid user document in the database
        UserModel.findOne({ _id: jwt_payload._id }).then((user) =>
        {
            if (!user)
            {
                return done(null, false)
            }
            return done(null, user)
        }).catch((err) =>
        {
            return done(err, false)
        })
    })
)