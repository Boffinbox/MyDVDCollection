export { };

const express = require("express")
const router = express.Router();

const TryCatchAsync = require("../helpers/TryCatchAsync")

const { ReferenceDVDModel } = require("../models");

// debug route
router.get("/testroute", TryCatchAsync(async (req, res, next) =>
{
    res.status(200).json({ status: "it worked" });
}))

// reference dvd logic
router.get("/", TryCatchAsync(async (req, res, next) =>
{
    const listOfAllReferenceDVDs = await ReferenceDVDModel.find({})
    const returnString = JSON.stringify(listOfAllReferenceDVDs);
    res.status(200).json(listOfAllReferenceDVDs);
}))
router.post("/", TryCatchAsync(async (req, res, next) =>
{
    const { title, barcode } = req.body
    console.log("Someone tried to use API to post a DVD");
    console.log(req.body)
    const newDisc = new ReferenceDVDModel({
        title,
        barcode
    });
    await newDisc.save();
    console.log(newDisc);
    res.status(201).json(newDisc);
}));

module.exports = router;