import axios from "axios";

export async function PostCollection(token: string | undefined, title: string)
{
    console.log("reached postcoll")
    if (token == undefined)
    {
        throw new Error("No access token supplied to post collection.");
    }
    const userData =
    {
        title: title
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` }
    }
    try
    {
        const response = await axios.post(`/api/v1/disccollections/`, userData, config)
        console.log("token used was: ", token);
        console.log("Post request received.");
        console.log(response.data)
        return response.data
    }
    catch (e)
    {
        throw new Error(`Failed to post new collection ${title}.`);
    }
}