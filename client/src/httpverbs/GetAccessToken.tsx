import { redirect } from "@tanstack/react-router";
import axios from "axios";

export async function GetAccessToken()
{
    const config =
    {
        withCredentials: true
    }
    try
    {
        console.log("Getting new access token...")
        console.log(`${import.meta.env.VITE_API_URL}/api/v1/users/refreshToken`)
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/refreshToken`, config)
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