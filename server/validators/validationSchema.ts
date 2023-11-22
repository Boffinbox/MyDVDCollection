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

const userSchema = Joi.object(
    {
        username: Joi.string().required().escapeHTML(),
        email: Joi.string().required().escapeHTML(),
        password: Joi.string().required().escapeHTML()
    }
).required()

module.exports.userSchema = userSchema;

const collectionSchema = Joi.object(
    {
        title: Joi.string().required().escapeHTML(),
    }
).required()

module.exports.collectionSchema = collectionSchema;

const userDVDSchema = Joi.object(
    {
        rating: Joi.number().min(1).max(5).required(),
        watched: Joi.boolean().required()
    }
).required()

module.exports.userDVDSchema = userDVDSchema;

const referenceDVDSchema = Joi.object(
    {
        barcode: Joi.string().length(13).required().escapeHTML(),
        title: Joi.string().escapeHTML()
    }
).required()

module.exports.referenceDVDSchema = referenceDVDSchema;

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