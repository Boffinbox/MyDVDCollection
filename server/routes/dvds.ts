const express = require("express")
const router = express.Router({ mergeParams: true });

const { verifyUser } = require("../auth/authenticate");

import { TryCatchAsync } from "../helpers/TryCatchAsync"
import
{
    ReferenceDVDModel,
    DVDModel,
    DiscCollectionModel,
    UserModel
} from "../models"

// dvd logic
// add a dvd to an existing collection by dvd barcode
router.post("/:barcode", verifyUser, TryCatchAsync(async (req, res, next) =>
{
    const userId = req.user._id
    const user = await UserModel.findById({ _id: userId })
    if (!user)
    {
        return res.status(401).send("Unauthorized");
    }
    if (!user.collections.includes(req.params.collectionId))
    {
        return res.status(401).send("Unauthorized");
    }
    const { collectionId, barcode } = req.params
    console.log(req.params);
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
        res.status(200).json({ dvd: newDVD });
    }
}));

// update a dvd in a collection by discId
router.patch("/:discId", TryCatchAsync(async (req, res, next) =>
{
    const { collectionId, discId }: { collectionId: string, discId: string } = req.params
    const { rating = 0, watched = false }: { rating: number, watched: boolean } = req.body;
    console.log("Someone tried to use API to update a dvd in a disc collection");
    console.log(`using the collId ${collectionId} and discId ${discId}`)
    const collectionToModify = await DiscCollectionModel.findById(collectionId)
        .populate("discs");
    if (!collectionToModify)
    {
        return res.status(400).json({ message: "couldn't find collection" });
    }
    const discInCollection = collectionToModify.discs.find((disc) =>
    {
        if (disc._id.toString() === discId)
        {
            console.log("we found the disc, proceed");
            return disc
        }
    })
    if (!discInCollection)
    {
        console.log("we couldn't find the disc, rip");
        return res.status(400).json({ message: "couldn't find dvd with this discId" });
    }
    const discToModify = await DVDModel.findById(discInCollection._id);
    if (!discToModify)
    {
        console.log("Couldn't find disc despite having disc??, aborting...");
        res.status(400).json({ message: "stop trying to modify dvds that aren't yours!" });
    }
    else
    {
        console.log("found disc: ", discToModify)
        discToModify.rating = rating;
        discToModify.watched = watched;
        await discToModify.save();
        res.status(200).json({ message: "it worked" });
    }
}));

// remove a dvd from an existing collection by discId
router.delete("/:discId", TryCatchAsync(async (req, res, next) =>
{
    const { collectionId, discId } = req.params
    console.log("Someone tried to use API to remove a dvd from a disc collection");
    console.log(`using the collId ${collectionId} and disc id ${discId}`)
    await DVDModel.findByIdAndDelete(discId);
    await DiscCollectionModel.findByIdAndUpdate(collectionId, { $pull: { discs: discId } });
    res.status(200).json({ message: "it worked" });
}));

module.exports = router;