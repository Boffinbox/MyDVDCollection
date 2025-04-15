import axios from "axios";
import DevLog from "../utilities/DevLog";

export async function GetReference(
    token: string | undefined,
    refId: string)
{
    DevLog("reached getreference")
    if (token == undefined)
    {
        throw new Error("No access token supplied to get reference.");
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    }
    try
    {
        const response = await axios.get(`/api/v1/referencedvds/${refId}`, config)
        DevLog("token used was: ", token);
        DevLog("Getrequest received.");
        DevLog(response.data)
        return response.data
    }
    catch (e)
    {
        throw new Error(`Failed to get refdisc ${refId}`);
    }
}