import { redirect } from "@tanstack/react-router";
import axios from "axios";

export async function GetAccessToken()
{
    try
    {
        console.log("Getting new access token...")
        const response = await axios.post(`/api/v1/users/refreshToken`)
        console.log("Refresh request received.");
        console.log(response.data.token);
        return response.data.token;
    }
    catch (e)
    {
        throw redirect({
            to: "/login"
        })
    }
}