import axios from "axios";

export async function PatchCollection(token: string | undefined, collectionId: string, title: string)
{
    console.log("reached patchcoll")
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
        headers: { Authorization: `Bearer ${token}` }
    }
    try
    {
        const response = await axios.patch(`/api/v1/disccollections/${collectionId}`, userData, config)
        console.log("token used was: ", token);
        console.log("Patch request received.");
        console.log(response.data)
        return response.data
    }
    catch (e)
    {
        throw new Error(`Failed to patch collection ${collectionId} with title ${title}.`);
    }
}