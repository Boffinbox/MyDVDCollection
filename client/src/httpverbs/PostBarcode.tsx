import axios from "axios";
import DevLog from "../utilities/DevLog";

export async function PostBarcode(token: string | undefined, collectionId: string, barcode: string)
{
    DevLog("reached postbarcode")
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
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    }
    try
    {
        const response = await axios.post(`/api/v1/disccollections/${collectionId}/userdvds`, userData, config)
        DevLog("token used was: ", token);
        DevLog("Post request received.");
        DevLog(response.data)
        return response.data
    }
    catch (e)
    {
        throw new Error(`Failed to post barcode ${barcode}.`);
    }
}