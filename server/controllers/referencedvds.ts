export { };

const { ReferenceDVDModel } = require("../models");

export async function getAllReferenceDVDs(req, res)
{
    const listOfAllReferenceDVDs = await ReferenceDVDModel.find({})
    res.status(200).json(listOfAllReferenceDVDs);
}

export async function newReferenceDVD(req, res)
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
}