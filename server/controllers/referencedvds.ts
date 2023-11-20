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
        const externalDVDInfo = await fetchExternalDVD(barcode);
        if (!externalDVDInfo)
        {
            return null;
        }
        const { title } = externalDVDInfo.items[0]
        const newRefDVD = await newReferenceDVD(barcode, title);
        return newRefDVD;
    }
}

async function fetchExternalDVD(barcode: string = `7321905737437`)
{
    console.log(`WARNING - BURNING 1 API CALL, with barcode: ${barcode}`)
    const response = await axios.get(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`)
        .then((res) => { return res; })
        .catch((e) => { console.log(e); return null; })
    console.log(response.data);
    return response.data
}

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