export { };

const { loginSchema } = require("./validationSchema");

const ExpressError = require("../helpers/expresserror");

const validateLogin = (req, res, next) =>
{
    const { error } = loginSchema.validate(req.body);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',');
        console.log("User Login validation failed");
        throw new ExpressError(400, msg);
    }
    else
    {
        console.log("User Login validated successfully");
        next();
    }
}

module.exports = validateLogin;