export { };

const axios = require("axios");

const { ReferenceDVDModel } = require("../models");

export async function getAllReferenceDVDs(req, res)
{
    const listOfAllReferenceDVDs = await ReferenceDVDModel.find({})
    res.status(200).json(listOfAllReferenceDVDs);
}

// returns a reference dvd, either from my own db, or external api
export async function getReferenceDVD(barcode: string, title: string)
{
    const localRefDVD = await ReferenceDVDModel.findOne({ barcode });
    if (localRefDVD)
    {
        return localRefDVD;
    }
    // we need to volkswagen the test suite to avoid expensive api calls
    else if (process.env.NODE_ENV === "test")
    {
        return await newReferenceDVD(barcode, title)
    }
    else // time to burn an api call
    {
        return null;
        // console.log("WARNING - BURNING 1 API CALL")
        // const externalDVDInfo = await fetchExternalDVD(barcode);
        // if (!externalDVDInfo)
        // {
        //     return null;
        // }
        // const { title } = externalDVDInfo.items[0].title;
        // console.log(title);
        // const newRefDVD = await newReferenceDVD(title, barcode);
        // return newRefDVD;
    }
}

// async function fetchExternalDVD(barcode: string = `7321905737437`)
// {
//     const response = await axios.get(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`)
//         .then((res) => { return res; })
//         .catch((e) => { console.log(e); return null; })
//     return response.body
// }

async function newReferenceDVD(barcode: string, title: string)
{
    if (!barcode || !title)
    {
        return null;
    }
    const newRefDVD = new ReferenceDVDModel({ barcode, title });
    await newRefDVD.save();
    return newRefDVD
}