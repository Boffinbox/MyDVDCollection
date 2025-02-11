import axios from "axios";

export async function PostReference(
    {
        token,
        barcode,
        title = "unknown"
    }: {
        token: string | undefined,
        barcode: string,
        title: string
    }
)
{
    console.log("reached postreference")
    if (token == undefined)
    {
        throw new Error("No access token supplied to post reference.");
    }
    const userData =
    {
        barcode: barcode,
        title: title
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` }
    }
    try
    {
        const response = await axios.post(`/api/v1/referencedvds`, userData, config)
        console.log("token used was: ", token);
        console.log("Post request received.");
        console.log(response.data)
        return response.data
    }
    catch (e)
    {
        console.log(`error thrown, barcode: ${barcode}, title: ${title}`)
        console.log(title)
        throw new Error(`Failed to post barcode ${barcode} and title ${title}`);
    }
}