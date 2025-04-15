import axios from "axios";
import DevLog from "../utilities/DevLog";

export async function DeleteDisc(token: string | undefined, collectionId: string, discId: string)
{
    if (token == undefined)
    {
        throw new Error("No access token supplied to delete disc.");
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    }
    try
    {
        const response = await axios.delete(`/api/v1/disccollections/${collectionId}/userdvds/${discId}`, config)
        DevLog("token used was: ", token);
        DevLog("Deletion request received.");
        DevLog(response.data)
        return response.data
    }
    catch (e)
    {
        throw new Error(`Failed to delete disc ${discId}.`);
    }
}