export { };

const { registrationSchema } = require("./validationSchema");

const ExpressError = require("../helpers/expresserror");

const validateRegistration = (req, res, next) =>
{
    const { error } = registrationSchema.validate(req.body);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',');
        console.log(`User registration validation failed, with reason: ${msg}`);
        throw new ExpressError(400, msg);
    }
    else
    {
        console.log("User registration validated successfully");
        next();
    }
}

module.exports = validateRegistration;