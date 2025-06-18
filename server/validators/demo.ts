export { };

const { demoSchema } = require("./validationSchema");

const ExpressError = require("../helpers/ExpressError");

const validateDemo = (req, res, next) =>
{
    const { error } = demoSchema.validate(req.body);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',');
        console.log(`User demo toggle validation failed, with reason: ${msg}`);
        throw new ExpressError(400, msg);
    }
    else
    {
        console.log("User demo toggle validated successfully");
        next();
    }
}

module.exports = validateDemo;