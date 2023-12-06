export { };

const { patchDVDSchema } = require("./validationSchema");

const ExpressError = require("../helpers/expresserror");

const validatePatchDVD = (req, res, next) =>
{
    const { error } = patchDVDSchema.validate(req.body);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',');
        console.log(`Patch DVD validation failed, with reason: ${msg}`);
        throw new ExpressError(400, msg);
    }
    else
    {
        console.log("Patch DVD validated successfully");
        next();
    }
}

module.exports = validatePatchDVD;