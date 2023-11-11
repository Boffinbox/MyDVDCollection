export { };

if (process.env.NODE_ENV !== "production")
{
    require("dotenv").config();
}

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport")
const app = express();

const ExpressError = require("./helpers/ExpressError")

const disccollectionRoutes = require("./routes/disccollections");
const referencedvdRoutes = require("./routes/referencedvds");
const dvdRoutes = require("./routes/dvds");
const userRoutes = require("./routes/users");

if (process.env.NODE_ENV !== "test")
{
    require("./helpers/ConnectDB");
}

require("./auth/LocalStrategy");
require("./auth/JwtStrategy");
require("./auth/authenticate");

// start middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(passport.initialize());

// routers
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/referencedvds", referencedvdRoutes)
app.use("/api/v1/disccollections", disccollectionRoutes)
app.use("/api/v1/disccollections/:collectionId/dvds", dvdRoutes)

// error handling
app.use((req, res, next) =>
{
    next(new ExpressError(404, "Page not found :("));
})

// Fallback Error handler for any reason
app.use((err, req, res, next) =>
{
    if (!err.status) err.status = 500;
    if (!err.message) err.message = "Something went wrong.";
    res.status(err.status).send(`${err.status}: ${err.message}`);
});

module.exports = app