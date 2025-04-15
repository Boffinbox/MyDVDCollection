import { redirect } from "@tanstack/react-router";
import axios from "axios";
import DevLog from "../utilities/DevLog";

export async function GetAccessToken()
{
    const config =
    {
        withCredentials: true
    }
    try
    {
        DevLog("Getting new access token...")
        const response = await axios.post(`/api/v1/users/refreshToken`, null, config)
        DevLog("Refresh request received.");
        DevLog(response.data.token);
        return response.data.token;
    }
    catch (e)
    {
        throw redirect({
            to: "/login"
        })
    }
}