import axios from "axios";

export async function GetAccessToken()
{
    try
    {
        const response = await axios.post(`/api/v1/users/refreshToken`)
        console.log("Refresh request received.");
        console.log(response.data.token);
        return response.data.token;
    }
    catch (e)
    {
        throw new Error("Unable to refresh token.");
    }
}