export { };

const baseJoi = require("joi");
const sanitizeHtml = require('sanitize-html');

const htmlSanitizeExtension = (baseJoi) => ({
    type: "string",
    base: baseJoi.string(),
    messages: {
        "string.escapeHTML": "Hey! {{#label}} must not include HTML. Stop trying to be tricky!"
    },
    rules: {
        escapeHTML: {
            validate(value, helpers)
            {
                let clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean.includes('&amp;'))
                {
                    clean = clean.replace(/&amp;/g, '&');
                }
                if (clean !== value)
                {
                    return helpers.error("string.escapeHTML", { value });
                }
                else
                {
                    return clean;
                }
            }
        }
    }
});

const Joi = baseJoi.extend(htmlSanitizeExtension);

const idSchema = Joi.string().length(24).escapeHTML().required()
const barcodeSchema = Joi.number().min(0).max(9999999999999).required()

const registrationSchema = Joi.object(
    {
        username: Joi.string().max(128).escapeHTML().required(),
        email: Joi.string().max(128).escapeHTML().required(),
        password: Joi.string().max(128).escapeHTML().required(),
        registrationKey: Joi.string().escapeHTML().required()
    }
).required()

const loginSchema = Joi.object(
    {
        username: Joi.string().max(128).escapeHTML(),
        email: Joi.string().max(128).escapeHTML().required(),
        password: Joi.string().max(128).escapeHTML().required()
    }
).required()

const newCollectionSchema = Joi.object(
    {
        title: Joi.string().max(128).escapeHTML().required(),
    }
).required()

const newDVDSchema = Joi.object(
    {
        barcode: barcodeSchema,
        title: Joi.string().max(128).escapeHTML()
    }
).required()

const patchDVDSchema = Joi.object(
    {
        rating: Joi.number().min(1).max(5),
        watched: Joi.boolean()
    }
).required()

module.exports = {
    registrationSchema,
    loginSchema,
    newCollectionSchema,
    barcodeSchema,
    newDVDSchema,
    patchDVDSchema,
    idSchema
};

// const collectionSchema = Joi.object(
//     {
//         title: Joi.string().required().escapeHTML(),
//     }
// ).required()

// module.exports.collectionSchema = collectionSchema;

// const userDVDSchema = Joi.object(
//     {
//         rating: Joi.number().min(1).max(5).required(),
//         watched: Joi.boolean().required()
//     }
// ).required()

// module.exports.userDVDSchema = userDVDSchema;

// const referenceDVDSchema = Joi.object(
//     {
//         barcode: Joi.string().length(13).required().escapeHTML(),
//         title: Joi.string().escapeHTML()
//     }
// ).required()

// module.exports.referenceDVDSchema = referenceDVDSchema;

// const campgroundSchema = Joi.object({
//     campground: Joi.object({
//         title: Joi.string().required().escapeHTML(),
//         location: Joi.string().required().escapeHTML(),
//         // image: Joi.string().required(),
//         price: Joi.number().required().min(0),
//         description: Joi.string().required().escapeHTML()
//     }).required(),
//     deleteImages: Joi.array()
// });

// module.exports.campgroundSchema = campgroundSchema;