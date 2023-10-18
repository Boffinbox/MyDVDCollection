import passport from "passport"
import { UserModel } from "../models/models"

const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

// Used by the authenticated requests to deserialize the user,
// i.e., to fetch user details from the JWT.
passport.use(
    new JwtStrategy(opts, function (jwt_payload, done)
    {
        // Check against the DB only if necessary.
        // This can be avoided if you don't want to fetch user details in each request.
        UserModel.findOne({ _id: jwt_payload._id }).then((user) =>
        {
            if (!user)
            {
                return done(null, false)
            }
            // or you could create a new account
            return done(null, user)
        }).catch((err) =>
        {
            return done(err, false)
        })
    })
)