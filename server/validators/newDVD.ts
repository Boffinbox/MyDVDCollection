export { };

const { newDVDSchema } = require("./validationSchema");

const ExpressError = require("../helpers/expresserror");

const validateNewDVD = (req, res, next) =>
{
    const { error } = newDVDSchema.validate(req.body);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',');
        console.log(`New DVD validation failed, with reason: ${msg}`);
        throw new ExpressError(400, msg);
    }
    else
    {
        console.log("New DVD validated successfully");
        next();
    }
}

module.exports = validateNewDVD;