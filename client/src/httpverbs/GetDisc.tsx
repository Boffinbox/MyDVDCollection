import axios from "axios";

export async function GetDisc(token: string | undefined, collectionId: string, discId: string)
{
    if (token == undefined)
    {
        throw new Error("No access token supplied to get disc.");
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` }
    }
    try
    {
        const response = await axios.get(`/api/v1/disccollections/${collectionId}/userdvds/${discId}`, config)
        console.log("token used was: ", token);
        console.log("User disc request received.");
        console.log(response.data);
        return response.data;
    }
    catch (e)
    {
        throw new Error("Failed to fetch user's disc.");
    }
}