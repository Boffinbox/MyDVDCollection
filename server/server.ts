const express = require("express");
const app = express();

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
app.listen(port, (err) =>
{
    if (err)
    {
        console.log(`Problem found with serving app on ${port}:` + err);
    }
    console.log(`Server started on port ${port}`)
})