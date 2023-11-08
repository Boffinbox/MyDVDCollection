const express = require("express")
const router = express.Router();

const { verifyUser } = require("../auth/authenticate");

import { TryCatchAsync } from "../helpers/TryCatchAsync"
import { DiscCollectionModel, UserModel } from "../models"

// disc collection restful routing
// index a list of all disc collections (in future: only DCs that user is authorized to see)
router.get("/", verifyUser, TryCatchAsync(async (req, res, next) =>
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
router.post("/", verifyUser, TryCatchAsync(async (req, res, next) =>
{
    const userId = req.user._id
    const user = await UserModel.findById({ _id: userId });
    if (!user)
    {
        return res.status(401).send("Unauthorized");
    }
    const { title } = req.body
    console.log("Someone tried to use API to post a disc collection");
    console.log("with the title of: ", req.body)
    const newDiscCollection = new DiscCollectionModel({
        title,
        discs: []
    });
    user.collections.push(newDiscCollection._id);
    await newDiscCollection.save();
    await user.save();
    console.log("New disccollection added to db");
    res.status(201).json(newDiscCollection);
}));

// delete route, to nuke a collection from orbit
router.delete("/:collectionId", verifyUser, TryCatchAsync(async (req, res, next) =>
{
    const userId = req.user._id
    const user = await UserModel.findById({ _id: userId });
    if (!user)
    {
        return res.status(401).send("Unauthorized");
    }
    const { collectionId } = req.params
    console.log("Someone tried to use API to post a disc collection");
    console.log(`using the param ${collectionId}`)
    const collectionToDelete = await DiscCollectionModel.findOneAndDelete(
        {
            _id: collectionId
        }
    )
    console.log(`Collection ${collectionToDelete} is possibly removed from DB`);
    await UserModel.findByIdAndUpdate(userId, { $pull: { collections: collectionId } });
    res.status(200).json(collectionToDelete);
}));

module.exports = router;