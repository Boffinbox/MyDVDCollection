export { };

const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.COOKIE_OPTIONS = {
    httpOnly: true,
    // setting cookies to "secure true" means that
    // we're gonna need a https dev environment...
    secure: true,
    signed: true,
    maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY ? process.env.REFRESH_TOKEN_EXPIRY : "60 * 60 * 24 * 5") * 1000,
    sameSite: "none",
}

exports.getToken = function (user)
{
    return jwt.sign(user, process.env.JWT_SECRET, {
        // use env session expiry, if missing then set expiry to 5 minutes
        expiresIn: eval(process.env.SESSION_EXPIRY ? process.env.SESSION_EXPIRY : "60 * 5"),
    })
}

exports.getRefreshToken = function (user)
{
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        // use env refresh expiry, if missing then set expiry to 5 days
        expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY ? process.env.REFRESH_TOKEN_EXPIRY : "60 * 60 * 24 * 5"),
    })
    return refreshToken
}

exports.verifyUser = passport.authenticate("jwt", { session: false })