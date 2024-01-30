import axios from "axios";

export async function DeleteCollection(token: string | undefined, collectionId: string)
{
    if (token == undefined)
    {
        throw new Error("No access token supplied to delete collection.");
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` }
    }
    try
    {
        const response = await axios.delete(`/api/v1/disccollections/${collectionId}`, config)
        console.log("token used was: ", token);
        console.log("Deletion request received.");
        return response.data
    }
    catch (e)
    {
        throw new Error(`Failed to delete collection ${collectionId}.`);
    }
}