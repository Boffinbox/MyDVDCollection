export { };

const axios = require("axios");

const { ReferenceDVDModel } = require("../models");

export async function getAllReferenceDVDs(req, res)
{
    const listOfAllReferenceDVDs = await ReferenceDVDModel.find({})
    res.status(200).json(listOfAllReferenceDVDs);
}

export async function getSoloReferenceDVD(req, res)
{
    const { referenceId }: { referenceId: string } = req.params
    if (!referenceId)
    {
        return res.status(404).json({ message: "refdisc not found" });
    }
    const refDVD = await ReferenceDVDModel.findOne({ _id: referenceId });
    if (!refDVD)
    {
        return res.status(404).json({ message: "refdisc not found" });
    }
    return res.status(200).json(refDVD)
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
    // i can only afford 100 calls per day, lol
    else if (process.env.NODE_ENV === "test")
    {
        // supply a fake reference dvd for testing, with hardcoded title, and confirmed to be "true" data
        return await newReferenceDVD(barcode, title, true)
    }
    else // time to burn an api call
    {
        // const externalDVDInfo = exampleUPCItemDBData();
        return await externalAPICall(barcode, title, true)
    }
}

async function externalAPICall(barcode: string, title: string, isNew: boolean)
{
    // cheat the test suite by sending nothing back
    if (process.env.NODE_ENV === "test")
    {
        return null
    }
    // const externalDVDInfo = exampleUPCItemDBData();
    const response = await fetchExternalDVD(barcode);
    // codes: OK, TOO_FAST, EXCEED_LIMIT, NOT_FOUND, INVALID_UPC, INVALID_QUERY
    // rate limits are 100 per 24 hours, and 6 per 60 seconds
    if (response == undefined || response.data.code != "OK") // if something wrong with request...
    {
        console.log("unable to reach or use upcitemdb")
        if (response && response.data.code == "EXCEED_LIMIT")
        {
            console.log("server is maxed out on requests for the day")
        }
        if (isNew)
        {
            console.log(`speculatively adding ${barcode} anyway`)
            const newRefDVD = await newReferenceDVD(barcode, "unknown", false);
            return newRefDVD;
        }
        else
        {
            return null
        }
    }
    const externalDVDInfo = response.data
    if (!isNew)
    {
        return externalDVDInfo
    }
    console.log("upcitemdb valid lookup, make a disc")
    if (externalDVDInfo.items.length > 0)
    {
        const { title } = externalDVDInfo.items[0]
        const newRefDVD = await newReferenceDVD(barcode, title, true, externalDVDInfo.items[0]);
        return newRefDVD;
    }
    else // if external db does not have it, make an unknown...
    {
        console.log("upcitemdb doesn't have it :(");
        const newRefDVD = await newReferenceDVD(barcode, "unknown", true);
        return newRefDVD;
    }
}

async function fetchExternalDVD(barcode: string = `7321905737437`)
{
    // never do a call if we are in a test
    if (process.env.NODE_ENV === "test")
    {
        return undefined
    }
    console.log(`WARNING - BURNING 1 API CALL, with barcode: ${barcode}`)
    const response = await axios.get(process.env.UPCITEMDB_URL + `${barcode}`, { validateStatus: () => true })
        .then((res) => { return res; })
        .catch((e) => { return e.response })
    console.log(`upcitemdb's response is:`);
    if (response == undefined)
    {
        console.log(response)
    }
    else
    {
        console.log(response.data)
    }
    return response
}

async function newReferenceDVD(barcode: string, title: string, upcitemdb_truedata: boolean = false, details?)
{
    if (!barcode || !title)
    {
        return null;
    }
    const upcitemdb_title = title
    if (details)
    {
        const newRefDVD = new ReferenceDVDModel({ barcode, title, upcitemdb_title, upcitemdb_truedata, ...details });
        await newRefDVD.save();
        return newRefDVD
    }
    else
    {
        const newRefDVD = new ReferenceDVDModel({ barcode, title, upcitemdb_title, upcitemdb_truedata });
        await newRefDVD.save();
        return newRefDVD
    }
}

export async function updateReferenceDVD(req, res)
{
    const { barcode, title } = req.body
    if (!barcode || !title)
    {
        return res.status(400).json({ message: "bad format" });
    }
    let referenceDVDToUpdate = await ReferenceDVDModel.findOne({ barcode });
    if (!referenceDVDToUpdate)
    {
        return res.status(404).json({ message: "barcode not found in references" });
    }
    referenceDVDToUpdate.title = title // set the title, before checking if there is new data
    if (referenceDVDToUpdate.upcitemdb_truedata == false) // do a upcitemdb pass to try and get the real data
    {

        let newDVDData = await externalAPICall(barcode, title, false)
        if (newDVDData)
        {
            console.log(`we got data!`)
            referenceDVDToUpdate.upcitemdb_truedata = true
            if (newDVDData.items.length > 0)
            {
                let upcdata = newDVDData.items[0]
                referenceDVDToUpdate.title = upcdata.title
                referenceDVDToUpdate.upcitemdb_title = upcdata.title
                referenceDVDToUpdate.ean = upcdata.ean
                referenceDVDToUpdate.upc = upcdata.upc
                referenceDVDToUpdate.gtin = upcdata.gtin
                referenceDVDToUpdate.asin = upcdata.asin
                referenceDVDToUpdate.description = upcdata.description
                referenceDVDToUpdate.brand = upcdata.brand
                referenceDVDToUpdate.model = upcdata.model
                referenceDVDToUpdate.dimension = upcdata.dimension
                referenceDVDToUpdate.weight = upcdata.weight
                referenceDVDToUpdate.category = upcdata.category
                referenceDVDToUpdate.currency = upcdata.currency
                referenceDVDToUpdate.lowest_recorded_price = upcdata.lowest_recorded_price
                referenceDVDToUpdate.highest_recorded_price = upcdata.highest_recorded_price
                referenceDVDToUpdate.images = upcdata.images
            }
        }
    }
    await referenceDVDToUpdate.save()
    console.log(referenceDVDToUpdate)
    return res.status(200).json(referenceDVDToUpdate);
}

function exampleUPCItemDBData()
{
    const data =
    {
        code: 'OK',
        total: 1,
        offset: 0,
        items: [
            {
                ean: '5039036072526',
                title: 'Futurama - Season 1-8 [dvd] [1999], 5039036072526, Peter Avanzino, Bret',
                description: 'All 125 episodes of Matt Groening&apos;s futuristic animated comedy. The show follows 20th-century slacker Philip J. Fry (voice of Billy Wes t) in his adventures as a 31st-century interstellar delivery boy along with cyclopean Captain Leela (Katey Sagal) and Bender the boozy robot (John DiMaggio). This set includes 23 discs. Rated 12. Not for individual resale. EAN: 5039036072526.',
                brand: '20th Century Fox Home Entertainment',
                model: '5713976',
                color: 'Black',
                size: '',
                dimension: '',
                weight: '1.50 lb',
                category: 'Electronics > Video > Video Players & Recorders > DVD & Blu-ray Players',
                currency: 'GBP',
                lowest_recorded_price: 17.99,
                highest_recorded_price: 74.93,
                images: [Array],
                offers: [Array],
                elid: '142923040872'
            }
        ]
    }
    return data;
}