if (process.env.NODE_ENV !== "production")
{
    require("dotenv").config();
}

const express = require("express");
const logger = require("morgan");
const app = express();

import { ExpressError } from "./helpers/ExpressError"
import { TryCatchAsync } from "./helpers/TryCatchAsync"
import { DVD } from "./models/dvd"

// start up mongoose
const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/myDVDCollectionDB"
// break glass to manually override
// const dbUrl = "mongodb://127.0.0.1:27017/myDVDCollectionDB"
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

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get("/api", TryCatchAsync(async (req, res, next) =>
{
    const allDVDs = await DVD.find({})
    const returnString = JSON.stringify(allDVDs);
    res.send(returnString);

}))
app.post("/api", TryCatchAsync(async (req, res, next) =>
{
    console.log("Someone tried to use API post");
    console.log(req.body)
    const newDisc = new DVD({
        title: "The Test DVD",
        barcode: `0123456789012`
    });
    await newDisc.save();
    console.log(newDisc);
    res.status(200).json(req.body);
}));

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