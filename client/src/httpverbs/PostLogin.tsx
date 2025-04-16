import axios from "axios";
import DevLog from "../utilities/DevLog";

export async function PostLogin(email: string, password: string)
{
    const userData = {
        email,
        password
    }
    const config =
    {
        withCredentials: true
    }
    try
    {
        const response = await axios.post(`/api/v1/users/login`, userData, config)
        DevLog("Login post request received.");
        DevLog(response.data.token)
        return response.data.token
    }
    catch (e)
    {
        throw new Error(`Failed to login.`);
    }
}