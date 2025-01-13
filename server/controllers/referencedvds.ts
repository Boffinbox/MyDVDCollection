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
    // i can only afford 100 calls per day, lol
    else if (process.env.NODE_ENV === "test")
    {
        // supply a fake reference dvd for testing, with hardcoded title
        return await newReferenceDVD(barcode, title)
    }
    else // time to burn an api call
    {
        // const externalDVDInfo = exampleUPCItemDBData();
        const response = await fetchExternalDVD(barcode);
        if (response == undefined)
        {
            console.log("unable to reach upcitemdb")
            console.log(`speculatively adding ${barcode} anyway`)
            const newRefDVD = await newReferenceDVD(barcode, "unknown", false);
            return newRefDVD;
        }
        const externalDVDInfo = response.data
        if (externalDVDInfo.code == "OK") // if external db check was valid
        {
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
        else // if something wrong with request...
        {
            console.log("upcitemdb possibly maxed out?")
            console.log(`speculatively adding ${barcode} anyway`)
            const newRefDVD = await newReferenceDVD(barcode, "unknown", false);
            return newRefDVD;
        }
    }
}

async function fetchExternalDVD(barcode: string = `7321905737437`)
{
    console.log(`WARNING - BURNING 1 API CALL, with barcode: ${barcode}`)
    const response = await axios.get(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`, { validateStatus: () => true })
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
    const referenceDVDToUpdate = await ReferenceDVDModel.findOne({ barcode });
    if (!referenceDVDToUpdate)
    {
        return res.status(404).json({ message: "barcode not found in references" });
    }
    referenceDVDToUpdate.title = title
    await referenceDVDToUpdate.save()
    console.log(referenceDVDToUpdate)
    res.status(200).json(referenceDVDToUpdate);
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