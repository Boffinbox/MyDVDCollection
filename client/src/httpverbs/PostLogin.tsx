import axios from "axios";

export async function PostLogin(email: string, password: string)
{
    const userData = {
        email,
        password
    }
    try
    {
        const response = await axios.post(`/api/v1/users/login`, userData)
        console.log("Login post request received.");
        console.log(response.data.token)
        return response.data.token
    }
    catch (e)
    {
        throw new Error(`Failed to login.`);
    }
}