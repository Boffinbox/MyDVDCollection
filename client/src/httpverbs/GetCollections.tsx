import axios from "axios"
import DevLog from "../utilities/DevLog";

export async function GetCollections(token: string | undefined)
{
    if (token == undefined)
    {
        throw new Error("No access token supplied to get collections.");
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    }
    try
    {
        const response = await axios.get(`/api/v1/disccollections/`, config)
        DevLog("token used was: ", token);
        DevLog("Collections request received.");
        DevLog(response.data);
        return response.data;
    }
    catch (e)
    {
        throw new Error("Failed to fetch user's collections.");
    }
}