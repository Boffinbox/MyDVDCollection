export { };

const { barcodeSchema } = require("./validationSchema");

const ExpressError = require("../helpers/expresserror");

const validateBarcode = (req, res, next) =>
{
    const { error } = barcodeSchema.validate(req.params.barcode);
    if (error)
    {
        const msg = error.details.map(el => el.message).join(',');
        console.log(`Barcode validation failed, with reason: ${msg}`);
        throw new ExpressError(400, msg);
    }
    else
    {
        console.log("Barcode validated successfully");
        next();
    }
}

module.exports = validateBarcode;