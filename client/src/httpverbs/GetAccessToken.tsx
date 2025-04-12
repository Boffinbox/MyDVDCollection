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
        const response = await axios.post(`${process.env.DOMAIN}/api/v1/users/refreshToken`, config)
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