import axios from "axios";
import DevLog from "../utilities/DevLog";

export async function PatchCollection(token: string | undefined, collectionId: string, title: string)
{
    DevLog("reached patchcoll")
    if (token == undefined)
    {
        throw new Error("No access token supplied to patch collection.");
    }
    const userData =
    {
        title: title
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    }
    try
    {
        const response = await axios.patch(`/api/v1/disccollections/${collectionId}`, userData, config)
        DevLog("token used was: ", token);
        DevLog("Patch request received.");
        DevLog(response.data)
        return response.data
    }
    catch (e)
    {
        throw new Error(`Failed to patch collection ${collectionId} with title ${title}.`);
    }
}