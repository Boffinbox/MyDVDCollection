import axios from "axios";

export async function DeleteDisc(token: string | undefined, collectionId: string, discId: string)
{
    if (token == undefined)
    {
        throw new Error("No access token supplied to delete disc.");
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` }
    }
    try
    {
        const response = await axios.delete(`/api/v1/disccollections/${collectionId}/userdvds/${discId}`, config)
        console.log("token used was: ", token);
        console.log("Deletion request received.");
        console.log(response.data.message)
    }
    catch (e)
    {
        throw new Error(`Failed to delete disc ${discId}.`);
    }
}