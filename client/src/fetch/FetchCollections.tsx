import axios from "axios"

export async function FetchCollections(token: string | undefined)
{
    if (token == undefined)
    {
        throw new Error("No access token supplied to fetch collections.");
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` }
    }
    try
    {
        const response = await axios.get(`/api/v1/disccollections/`, config)
        console.log("token used was: ", token);
        console.log("Collection request received.");
        console.log(response.data);
        return response.data;
    }
    catch (e)
    {
        throw new Error("Failed to fetch user's collections.");
    }
}