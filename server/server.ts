if (process.env.NODE_ENV !== "production")
{
    require("dotenv").config();
}

const express = require("express");
const logger = require("morgan");
const app = express();

import { ExpressError } from "./helpers/ExpressError"
import { TryCatchAsync } from "./helpers/TryCatchAsync"
import
{
    ReferenceDVDModel, ReferenceDVD,
    DVDModel, DVD,
    DiscCollectionModel, DiscCollection
} from "./models/models"

// start up mongoose
import mongoose from "mongoose"
import e from "express";
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

// disc collection restful routing

// index a list of all disc collections (in future: only DCs that user is authorized to see)
app.get("/api/v1/disccollections", TryCatchAsync(async (req, res, next) =>
{
    const allCollections = await DiscCollectionModel
        .find({})
        .populate({
            path: "discs",
            populate: {
                path: "referenceDVD"
            }
        })
        .exec();
    const returnString = JSON.stringify(allCollections);
    res.status(200).send(returnString);
}))

// show individual disc collection
app.get("/api/v1/disccollections/:collectionId", TryCatchAsync(async (req, res, next) =>
{
    console.log(req.params.collectionId);
    const collectionOfConcern = await DiscCollectionModel
        .findOne({ _id: req.params.collectionId })
        .populate({
            path: "discs",
            populate: {
                path: "referenceDVD"
            }
        })
        .exec();
    const returnString = JSON.stringify(collectionOfConcern);
    res.status(200).send(returnString);
}))

// create new disc collection
app.post("/api/v1/disccollections", TryCatchAsync(async (req, res, next) =>
{
    const { title } = req.body
    console.log("Someone tried to use API to post a disc collection");
    console.log("with the title of: ", req.body)
    const newDiscCollection = new DiscCollectionModel({
        title,
        discs: []
    });
    await newDiscCollection.save();
    console.log("New disccollection added to db");
    res.status(201).json(newDiscCollection);
}));

// delete route, to nuke a collection from orbit
app.delete("/api/v1/disccollections/:collectionId", TryCatchAsync(async (req, res, next) =>
{
    const { collectionId } = req.params
    console.log("Someone tried to use API to post a disc collection");
    console.log(`using the param ${collectionId}`)
    const collectionToDelete = await DiscCollectionModel.findOneAndDelete(
        {
            _id: collectionId
        }
    )
    console.log(`Collection ${collectionToDelete} is possibly removed from DB`);
    res.status(200).json(collectionToDelete);
}));

// dvd logic
// add a dvd to an existing collection by dvd barcode
app.post("/api/v1/disccollections/:collectionId/dvds/:barcode", TryCatchAsync(async (req, res, next) =>
{
    const { collectionId, barcode } = req.params
    console.log("Someone tried to use API to add a dvd to a disc collection");
    console.log(`using the collId ${collectionId} and barcode ${barcode}`)
    const collectionToModify = await DiscCollectionModel.findOne(
        {
            _id: collectionId
        }
    )
    const referenceDVD = await ReferenceDVDModel.findOne({ barcode });
    if (!referenceDVD || !collectionToModify)
    {
        console.log("Couldn't find DVD or collection, aborting...");
        res.status(400).json({ message: "couldn't find dvd with this barcode" });
    }
    else
    {
        console.log("Found a referencedvd: ", referenceDVD.title);
        const newDVD = new DVDModel({
            referenceDVD: referenceDVD._id,
            rating: 5,
            watched: false
        })
        await newDVD.populate("referenceDVD");
        collectionToModify.discs.push(newDVD._id);
        await newDVD.save();
        await collectionToModify.save();
        console.log(`DVD "${referenceDVD.title}" was added to Collection "${collectionToModify.title}"`);
        res.status(200).json({ message: "it worked" });
    }
}));

// update a dvd in a collection by discId
app.patch("/api/v1/disccollections/:collectionId/dvds/:discId", TryCatchAsync(async (req, res, next) =>
{
    const { collectionId, discId } = req.params
    const { rating = 0, watched = false }: { rating: number, watched: boolean } = req.body;
    console.log("Someone tried to use API to update a dvd in a disc collection");
    console.log(`using the collId ${collectionId} and discId ${discId}`)
    const collectionToModify = await DiscCollectionModel.findById(collectionId)
        .populate<{ discs: { _id: string }[] }>("discs");
    const discToModify = await DVDModel.findById(discId);
    if (!discToModify || !collectionToModify)
    {
        console.log("Couldn't find DVD or collection, aborting...");
        res.status(400).json({ message: "couldn't find dvd with this barcode" });
    }
    else
    {
        const discInCollection = collectionToModify.discs.find((disc) =>
        {
            if (disc._id.toString() === discId)
            {
                return disc
            }
        });
        if (discInCollection && discToModify._id.toString() == discInCollection._id)
        {
            console.log("found disc: ", discToModify)
            discToModify.rating = rating;
            discToModify.watched = watched;
            await discToModify.save();
            res.status(200).json({ message: "it worked" });
        }
        else
        {
            res.status(400).json({ message: "database error: couldn't find disc in collection" });
        }
    }
}));

// remove a dvd from an existing collection by discId
app.delete("/api/v1/disccollections/:collectionId/dvds/:discId", TryCatchAsync(async (req, res, next) =>
{
    const { collectionId, discId } = req.params
    console.log("Someone tried to use API to remove a dvd from a disc collection");
    console.log(`using the collId ${collectionId} and disc id ${discId}`)
    await DVDModel.findByIdAndDelete(discId);
    await DiscCollectionModel.findByIdAndUpdate(collectionId, { $pull: { discs: discId } });
    res.status(200).json({ message: "it worked" });
}));

// reference dvd logic
app.get("/api/v1/referencedvds", TryCatchAsync(async (req, res, next) =>
{
    const listOfAllReferenceDVDs = await ReferenceDVDModel.find({})
    const returnString = JSON.stringify(listOfAllReferenceDVDs);
    res.status(200).send(returnString);

}))
app.post("/api/v1/referencedvds", TryCatchAsync(async (req, res, next) =>
{
    const { title, barcode } = req.body
    console.log("Someone tried to use API to post a DVD");
    console.log(req.body)
    const newDisc = new ReferenceDVDModel({
        title,
        barcode
    });
    await newDisc.save();
    console.log(newDisc);
    res.status(201).json(req.body);
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