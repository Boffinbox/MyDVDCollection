export { };

const
    {
        ReferenceDVDModel,
        UserDVDModel,
        DiscCollectionModel,
    } = require("../models")

const getUserDocument = require("../helpers/GetUserDocument");

export async function addDVD(req, res)
{
    const user = await getUserDocument(req, res);
    if (!user.collections.includes(req.params.collectionId))
    {
        return res.status(401).send("Unauthorized");
    }
    const { collectionId } = req.params
    const { barcode } = req.body
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
        const newDVD = new UserDVDModel({
            referenceDVD: referenceDVD._id,
            rating: 5,
            watched: false
        })
        await newDVD.populate("referenceDVD");
        collectionToModify.discs.push(newDVD._id);
        await newDVD.save();
        await collectionToModify.save();
        console.log(`DVD "${referenceDVD.title}" was added to Collection "${collectionToModify.title}"`);
        res.status(201).json({ dvd: newDVD });
    }
}

export async function updateDVD(req, res)
{
    const user = await getUserDocument(req, res);
    if (!user.collections.includes(req.params.collectionId))
    {
        return res.status(401).send("Unauthorized - not a match");
    }
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
    const discToModify = await UserDVDModel.findById(discInCollection._id);
    if (!discToModify)
    {
        console.log("Couldn't find disc despite having disc??, aborting...");
        res.status(401).json({ message: "stop trying to modify dvds that aren't yours!" });
    }
    else
    {
        console.log("found disc: ", discToModify)
        discToModify.rating = rating;
        discToModify.watched = watched;
        await discToModify.save();
        res.status(200).json({ message: "it worked" });
    }
}

export async function deleteDVD(req, res)
{
    const user = await getUserDocument(req, res);
    if (!user.collections.includes(req.params.collectionId))
    {
        return res.status(401).send("Unauthorized");
    }
    const { collectionId, discId } = req.params
    const collectionToModify = await DiscCollectionModel.findById(collectionId)
    if (!collectionToModify)
    {
        return res.status(400).json({ message: "couldn't find collection" });
    }
    if (!collectionToModify.discs.includes(req.params.discId))
    {
        return res.status(401).json({ message: "wrong collection, disc mismatch" });
    }
    console.log("Someone tried to use API to remove a dvd from a disc collection");
    console.log(`using the collId ${collectionId} and disc id ${discId}`)
    await UserDVDModel.findByIdAndDelete(discId);
    await DiscCollectionModel.findByIdAndUpdate(collectionId, { $pull: { discs: discId } });
    res.status(200).json({ message: "it worked" });
}