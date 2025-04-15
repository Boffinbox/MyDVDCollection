import axios from "axios";
import DevLog from "../utilities/DevLog";

export async function GetCollection(token: string | undefined, collectionId: string)
{
    if (token == undefined)
    {
        throw new Error("No access token supplied to get collection.");
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    }
    try
    {
        const response = await axios.get(`/api/v1/disccollections/${collectionId}`, config)
        DevLog("token used was: ", token);
        DevLog("Collection request received.");
        DevLog(response.data);
        return response.data;
    }
    catch (e)
    {
        throw new Error("Failed to fetch user's collection.");
    }
}