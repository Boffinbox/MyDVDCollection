export { };

const { idSchema } = require("./validationSchema");

const ExpressError = require("../helpers/expresserror");

const validateReferenceId = (req, res, next) =>
{
    const { error } = idSchema.validate(req.params.referenceId);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',');
        console.log(`Reference ID validation failed, with reason: ${msg}`);
        throw new ExpressError(400, msg);
    }
    else
    {
        console.log("Reference ID validated successfully");
        next();
    }
}

module.exports = validateReferenceId;