import axios from "axios";

export async function PostBarcode(token: string | undefined, collectionId: string, barcode: string)
{
    console.log("reached postbarcode")
    if (token == undefined)
    {
        throw new Error("No access token supplied to post barcode.");
    }
    const userData =
    {
        barcode: barcode
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` }
    }
    try
    {
        const response = await axios.post(`/api/v1/disccollections/${collectionId}/userdvds`, userData, config)
        console.log("token used was: ", token);
        console.log("Post request received.");
        console.log(response.data)
    }
    catch (e)
    {
        throw new Error(`Failed to post barcode ${barcode}.`);
    }
}