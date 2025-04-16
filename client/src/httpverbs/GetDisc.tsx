import axios from "axios";
import DevLog from "../utilities/DevLog";

export async function GetDisc(token: string | undefined, collectionId: string, discId: string)
{
    if (token == undefined)
    {
        throw new Error("No access token supplied to get disc.");
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    }
    try
    {
        const response = await axios.get(`/api/v1/disccollections/${collectionId}/userdvds/${discId}`, config)
        DevLog("token used was: ", token);
        DevLog("User disc request received.");
        DevLog(response.data);
        return response.data;
    }
    catch (e)
    {
        throw new Error("Failed to fetch user's disc.");
    }
}