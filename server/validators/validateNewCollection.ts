export { };

const { newCollectionSchema } = require("./validationSchema");

const ExpressError = require("../helpers/expresserror");

const validateNewCollection = (req, res, next) =>
{
    const { error } = newCollectionSchema.validate(req.body);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',');
        console.log("New collection validation failed");
        throw new ExpressError(400, msg);
    }
    else
    {
        console.log("New collection validated successfully");
        next();
    }
}

module.exports = validateNewCollection;