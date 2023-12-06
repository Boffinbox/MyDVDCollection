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

const registrationSchema = Joi.object(
    {
        username: Joi.string().escapeHTML().required(),
        email: Joi.string().escapeHTML().required(),
        password: Joi.string().escapeHTML().required()
    }
).required()

const loginSchema = Joi.object(
    {
        username: Joi.string().escapeHTML(),
        email: Joi.string().escapeHTML().required(),
        password: Joi.string().escapeHTML().required()
    }
).required()

const newCollectionSchema = Joi.object(
    {
        title: Joi.string().max(64).escapeHTML().required(),
    }
).required()

const newDVDSchema = Joi.object(
    {
        barcode: Joi.string().min(12).max(13).escapeHTML().required(),
        title: Joi.string().max(64).escapeHTML()
    }
).required()

const patchDVDSchema = Joi.object(
    {
        rating: Joi.number().min(1).max(5),
        watched: Joi.boolean()
    }
).required()

const collectionIdSchema = Joi.string().length(24).escapeHTML().required()
const discIdSchema = Joi.string().length(24).escapeHTML().required()

module.exports = {
    registrationSchema,
    loginSchema,
    newCollectionSchema,
    newDVDSchema,
    patchDVDSchema,
    collectionIdSchema,
    discIdSchema
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