import axios from "axios";

export async function PostLogout(token: string)
{
    const config =
    {
        headers: { Authorization: `Bearer ${token}` }
    }
    try
    {
        const response = await axios.post(`/api/v1/users/logout`, ``, config)
        console.log("Logout request received - removing refresh cookie.");
        console.log(response)
    }
    catch (e)
    {
        throw new Error(`Failed to logout.`);
    }
}