import axios from "axios";
import DevLog from "../utilities/DevLog";

export async function PostLogout(token: string)
{
    const config =
    {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    }
    try
    {
        const response = await axios.post(`/api/v1/users/logout`, ``, config)
        DevLog("Logout request received - removing refresh cookie.");
        DevLog(response)
    }
    catch (e)
    {
        throw new Error(`Failed to logout.`);
    }
}