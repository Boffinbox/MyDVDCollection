import axios from "axios"
import DevLog from "../utilities/DevLog";

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
        const response = await axios.get(`/api/v1/referencedvds/barcodes`, config)
        DevLog("token used was: ", token);
        DevLog("Barcodes request received.");
        DevLog(response.data);
        return response.data;
    }
    catch (e)
    {
        throw new Error("Failed to fetch user's barcodes.");
    }
}