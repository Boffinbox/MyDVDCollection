import axios from "axios";
import DevLog from "../utilities/DevLog";

export async function PostReference(
    {
        token,
        barcode,
        title = "unknown"
    }: {
        token: string | undefined,
        barcode: string,
        title: string
    }
)
{
    DevLog("reached postreference")
    if (token == undefined)
    {
        throw new Error("No access token supplied to post reference.");
    }
    const userData =
    {
        barcode: barcode,
        title: title
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    }
    try
    {
        const response = await axios.post(`/api/v1/referencedvds`, userData, config)
        DevLog("token used was: ", token);
        DevLog("Post request received.");
        DevLog(response.data)
        return response.data
    }
    catch (e)
    {
        DevLog(`error thrown, barcode: ${barcode}, title: ${title}`)
        DevLog(title)
        throw new Error(`Failed to post barcode ${barcode} and title ${title}`);
    }
}