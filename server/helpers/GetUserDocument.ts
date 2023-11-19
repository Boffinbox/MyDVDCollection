export { };

const { UserModel } = require("../models")

export async function getUserDocument(req, res)
{
    const userId = req.user._id
    const user = await UserModel.findById({ _id: userId })
    if (!user)
    {
        return res.status(401).send("Unauthorized");
    }
    return user;
}

module.exports = getUserDocument;