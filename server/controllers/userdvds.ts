export { };

const
    {
        ReferenceDVDModel,
        UserDVDModel,
        DiscCollectionModel,
    } = require("../models")

const getUserDocument = require("../helpers/GetUserDocument");
const { getReferenceDVD } = require("./referencedvds.ts");

export async function addDVD(req, res)
{
    const user = await getUserDocument(req, res);
    if (!user.collections.includes(req.params.collectionId))
    {
        return res.status(401).send("Unauthorized");
    }
    const { collectionId } = req.params
    const { barcode, title } = req.body
    const collectionToModify = await DiscCollectionModel.findOne(
        {
            _id: collectionId
        }
    )
    if (!collectionToModify)
    {
        return res.status(503).send("Unavailable");
    }
    const referenceDVD = await getReferenceDVD(barcode, title);
    if (!referenceDVD)
    {
        res.status(503).json({ message: "couldn't find dvd with this barcode" });
    }
    else
    {
        const newDVD = new UserDVDModel({
            referenceDVD: referenceDVD._id,
            rating: 5,
            watched: false
        })
        await newDVD.populate("referenceDVD");
        collectionToModify.discs.push(newDVD._id);
        await newDVD.save();
        await collectionToModify.save();
        res.status(201).json(newDVD);
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
    const collectionToModify = await DiscCollectionModel.findById(collectionId)
        .populate("discs");
    if (!collectionToModify)
    {
        return res.status(503).json({ message: "couldn't find collection" });
    }
    const discInCollection = collectionToModify.discs.find((disc) =>
    {
        if (disc._id.toString() === discId)
        {
            return disc
        }
    })
    if (!discInCollection)
    {
        return res.status(503).json({ message: "couldn't find dvd with this discId" });
    }
    const discToModify = await UserDVDModel.findById(discInCollection._id);
    if (!discToModify)
    {
        res.status(401).json({ message: "stop trying to modify dvds that aren't yours!" });
    }
    else
    {
        discToModify.rating = rating;
        discToModify.watched = watched;
        await discToModify.save();
        res.status(200).json(discToModify);
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
        return res.status(503).json({ message: "couldn't find collection" });
    }
    if (!collectionToModify.discs.includes(req.params.discId))
    {
        return res.status(401).json({ message: "wrong collection, disc mismatch" });
    }
    const deletedDisc = await UserDVDModel.findByIdAndDelete(discId);
    await DiscCollectionModel.findByIdAndUpdate(collectionId, { $pull: { discs: discId } });
    res.status(200).json(deletedDisc);
}