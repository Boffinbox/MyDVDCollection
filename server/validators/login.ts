export { };

const { loginSchema } = require("./validationSchema");

const ExpressError = require("../helpers/expresserror");

const validateLogin = (req, res, next) =>
{
    const { error } = loginSchema.validate(req.body);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',');
        console.log(`User login validation failed, with reason: ${msg}`);
        throw new ExpressError(400, msg);
    }
    else
    {
        console.log("User login validated successfully");
        next();
    }
}

module.exports = validateLogin;