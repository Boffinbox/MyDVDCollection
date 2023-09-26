import express from "express"
const app = express();

// start up mongoose
const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp"
// break glass to manually override
// const dbUrl = "mongodb://127.0.0.1:27017/yelp-camp"
mongoose.connect(dbUrl)
    .then(() =>
    {
        console.log(`MongoDB Connection Open :)`);
    })
    .catch((err) =>
    {
        console.log("Oh no! MongoDB Connection Error :(");
        console.log(err);
    });
// end mongoose

import { ExpressError } from "./helpers/ExpressError"

app.get("/api", (req, res) =>
{
    res.json({ "dvds": ["indiana jones", "oppenheimer", "teletubbies", "die hard"] })
})

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