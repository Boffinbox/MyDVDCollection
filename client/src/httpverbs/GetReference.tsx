import axios from "axios";

export async function GetReference(
    token: string | undefined,
    refId: string)
{
    console.log("reached getreference")
    if (token == undefined)
    {
        throw new Error("No access token supplied to get reference.");
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` }
    }
    try
    {
        const response = await axios.get(`/api/v1/referencedvds/${refId}`, config)
        console.log("token used was: ", token);
        console.log("Getrequest received.");
        console.log(response.data)
        return response.data
    }
    catch (e)
    {
        throw new Error(`Failed to get refdisc ${refId}`);
    }
}