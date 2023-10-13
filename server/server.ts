if (process.env.NODE_ENV !== "production")
{
    require("dotenv").config();
}

const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();

import { ExpressError } from "./helpers/ExpressError"

const disccollectionRoutes = require("./routes/disccollections");
const referencedvdRoutes = require("./routes/referencedvds");
const dvdRoutes = require("./routes/dvds");

require("./helpers/ConnectDB");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKIE_SECRET));

// routers
app.use("/api/v1/referencedvds", referencedvdRoutes)
app.use("/api/v1/disccollections", disccollectionRoutes)
app.use("/api/v1/disccollections/:collectionId/dvds", dvdRoutes)

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

// Lastly, serve the app
const port = 5000;
app.listen(port, () =>
{
    console.log(`Server started on port ${port}`)
})