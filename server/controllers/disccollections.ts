export { };

const { DiscCollectionModel, UserModel } = require("../models")
const getUserDocument = require("../helpers/GetUserDocument");

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
    const user = await getUserDocument(req, res);
    if (!user.collections.includes(req.params.collectionId))
    {
        return res.status(401).send("Unauthorized");
    }
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

export async function newCollection(req, res)
{
    const user = await getUserDocument(req, res);
    const { title } = req.body
    const newDiscCollection = new DiscCollectionModel({
        title,
        discs: []
    });
    user.collections.push(newDiscCollection._id);
    await newDiscCollection.save();
    await user.save();
    res.status(201).json(newDiscCollection);
}

export async function deleteCollection(req, res)
{
    const user = await getUserDocument(req, res);
    const { collectionId } = req.params
    if (!user.collections.includes(collectionId))
    {
        return res.status(401).send("Unauthorized");
    }
    const collectionToDelete = await DiscCollectionModel.findOneAndDelete(
        {
            _id: collectionId
        }
    )
    await UserModel.findByIdAndUpdate(user._id, { $pull: { collections: collectionId } });
    res.status(200).json(collectionToDelete);
}