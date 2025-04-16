import axios from "axios";
import DevLog from "../utilities/DevLog";

export async function PostCollection(token: string | undefined, title: string)
{
    DevLog("reached postcoll")
    if (token == undefined)
    {
        throw new Error("No access token supplied to post collection.");
    }
    const userData =
    {
        title: title
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    }
    try
    {
        const response = await axios.post(`/api/v1/disccollections/`, userData, config)
        DevLog("token used was: ", token);
        DevLog("Post request received.");
        DevLog(response.data)
        return response.data
    }
    catch (e)
    {
        throw new Error(`Failed to post new collection ${title}.`);
    }
}