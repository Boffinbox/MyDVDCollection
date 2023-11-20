export { };

const { UserModel } = require("../models")

export async function getUserDocument(req, res, payloadId = undefined)
{
    const userId = payloadId ? payloadId : req.user._id
    const user = await UserModel.findById({ _id: userId })
    if (!user)
    {
        return res.status(401).send("Unauthorized");
    }
    return user;
}

module.exports = getUserDocument;