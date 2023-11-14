export { };

const { DiscCollectionModel, UserModel } = require("../models")

export async function index(req, res)
{
    const userId = req.user._id
    const user = await UserModel.findById({ _id: userId })
        .populate({
            path: "collections",
            populate: {
                path: "discs",
                populate: {
                    path: "referenceDVD"
                }
            }
        }).exec();
    if (!user)
    {
        return res.status(401).send("Unauthorized");
    }
    res.status(200).json(user.collections);
}

export async function showCollection(req, res)
{
    const userId = req.user._id
    const user = await UserModel.findById({ _id: userId })
    if (!user)
    {
        return res.status(401).send("Unauthorized");
    }
    if (user.collections.includes(req.params.collectionId))
    {
        const collectionOfConcern = await DiscCollectionModel
            .findOne({ _id: req.params.collectionId })
            .populate({
                path: "discs",
                populate: {
                    path: "referenceDVD"
                }
            })
            .exec();
        return res.status(200).json(collectionOfConcern);
    }
    else
    {
        return res.status(401).send("Unauthorized");
    }
}

export async function newCollection(req, res)
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
}

export async function deleteCollection(req, res)
{
    const userId = req.user._id
    const user = await UserModel.findById({ _id: userId });
    if (!user)
    {
        return res.status(401).send("Unauthorized");
    }
    const { collectionId } = req.params
    if (!user.collections.includes(collectionId))
    {
        return res.status(401).send("Unauthorized");
    }
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
}