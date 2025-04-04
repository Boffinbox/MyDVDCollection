import axios from "axios"

export async function GetBarcodes(token: string | undefined)
{
    if (token == undefined)
    {
        throw new Error("No access token supplied to get barcodes.");
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` }
    }
    try
    {
        const response = await axios.get(`/api/v1/referencedvds/barcodes`, config)
        console.log("token used was: ", token);
        console.log("Barcodes request received.");
        console.log(response.data);
        return response.data;
    }
    catch (e)
    {
        throw new Error("Failed to fetch user's barcodes.");
    }
}