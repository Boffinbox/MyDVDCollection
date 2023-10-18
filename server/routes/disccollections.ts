const express = require("express")
const router = express.Router();

import { TryCatchAsync } from "../helpers/TryCatchAsync"
import { DiscCollectionModel } from "../models/models"

// disc collection restful routing
// index a list of all disc collections (in future: only DCs that user is authorized to see)
router.get("/", TryCatchAsync(async (req, res, next) =>
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
    res.status(200).json(allCollections);
}))

// show individual disc collection
router.get("/:collectionId", TryCatchAsync(async (req, res, next) =>
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
    res.status(200).json(collectionOfConcern);
}))

// create new disc collection
router.post("/", TryCatchAsync(async (req, res, next) =>
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
router.delete("/:collectionId", TryCatchAsync(async (req, res, next) =>
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

module.exports = router;