import axios from "axios"

export async function GetUnknowns(token: string | undefined)
{
    if (token == undefined)
    {
        throw new Error("No access token supplied to get unknowns.");
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` }
    }
    try
    {
        const response = await axios.get(`/api/v1/disccollections/unknowns`, config)
        console.log("token used was: ", token);
        console.log("Unknowns request received.");
        console.log(response.data);
        return response.data;
    }
    catch (e)
    {
        throw new Error("Failed to fetch user's unknowns.");
    }
}