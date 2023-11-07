const express = require("express")
const router = express.Router();

import { TryCatchAsync } from "../helpers/TryCatchAsync"
import { ReferenceDVDModel } from "../models"

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
    res.status(201).json(req.body);
}));

module.exports = router;