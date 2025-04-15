import axios from "axios";
import DevLog from "../utilities/DevLog";

export async function DeleteCollection(token: string | undefined, collectionId: string)
{
    if (token == undefined)
    {
        throw new Error("No access token supplied to delete collection.");
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    }
    try
    {
        const response = await axios.delete(`/api/v1/disccollections/${collectionId}`, config)
        DevLog("token used was: ", token);
        DevLog("Deletion request received.");
        return response.data
    }
    catch (e)
    {
        throw new Error(`Failed to delete collection ${collectionId}.`);
    }
}