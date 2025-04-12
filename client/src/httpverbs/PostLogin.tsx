import axios from "axios";

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
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/login`, userData, config)
        console.log("Login post request received.");
        console.log(response.data.token)
        return response.data.token
    }
    catch (e)
    {
        throw new Error(`Failed to login.`);
    }
}