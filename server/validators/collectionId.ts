export { };

const { idSchema } = require("./validationSchema");

const ExpressError = require("../helpers/ExpressError");

const validateCollectionId = (req, res, next) =>
{
    const { error } = idSchema.validate(req.params.collectionId);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',');
        console.log(`Collection ID validation failed, with reason: ${msg}`);
        throw new ExpressError(400, msg);
    }
    else
    {
        console.log("Collection ID validated successfully");
        next();
    }
}

module.exports = validateCollectionId;