export async function GetCollection(collectionId: string, token: string | undefined)
{
    if (token == undefined)
    {
        throw new Error("No access token supplied to fetch collection.");
    }
    const config =
    {
        headers: { Authorization: `Bearer ${token}` }
        // headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTU3YTMwZGQ1ZTU0NDQxYjE1YjAyNDQiLCJ1c2VybmFtZSI6ImJvZmYiLCJpYXQiOjE3MDU2ODgwODQsImV4cCI6MTcwNTY4ODk4NH0.KX4OX42b_YWbSl9_qDL2CJM_kxZ7OxcmEjSjv7zia9g` }
    }
    // axios.get(`/api/v1/disccollections/${collectionId}`, config).then((response) =>
    // {
    //     console.log("Collection request received.");
    //     console.log(response.data);
    //     return response.data
    // }).catch((e) =>
    // {
    //     console.log(e);
    // })
    const res = await fetch(`/api/v1/disccollections/${collectionId}`, config)
    if (!res.ok) throw new Error("Failed to fetch user's collection.")
    return res.json()
}