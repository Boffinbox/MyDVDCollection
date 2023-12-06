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

const ExpressError = require("./helpers/ExpressError");

const router = require("./routes/router.ts");

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

// main router
app.use("/api/v1", router)

// heartbeat route
app.get("/heartbeat", async (req, res) =>
{
    res.status(200).json({ message: "i am alive" });
})

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
    return res.status(err.status).send(`${err.status}: ${err.message}`);
});

module.exports = app