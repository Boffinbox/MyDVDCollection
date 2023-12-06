export { };

const { discIdSchema } = require("./validationSchema");

const ExpressError = require("../helpers/expresserror");

const validateDiscId = (req, res, next) =>
{
    const { error } = discIdSchema.validate(req.params.discId);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',');
        console.log(`Disc ID validation failed, with reason: ${msg}`);
        throw new ExpressError(400, msg);
    }
    else
    {
        console.log("Disc ID validated successfully");
        next();
    }
}

module.exports = validateDiscId;