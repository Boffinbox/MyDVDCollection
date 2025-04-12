import axios from "axios"

export async function GetBarcodes(token: string | undefined)
{
    if (token == undefined)
    {
        throw new Error("No access token supplied to get barcodes.");
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    }
    try
    {
        const response = await axios.get(`${process.env.DOMAIN}/api/v1/referencedvds/barcodes`, config)
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