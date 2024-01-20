import { FileRoute } from "@tanstack/react-router"
import { useContext } from "react";
import { UserContext } from "../utilities/UserContext";

export const Route = new FileRoute('/collections/$collectionId').createRoute({
    loader: async ({ params: { collectionId } }: { params: { collectionId: string } }) => collectionFetch(collectionId),
    component: Collection
})

function Collection()
{
    // const user = useContext(UserContext);
    const data: [] = Route.useLoaderData();
    console.log(data)

    return (
        <>
            <div>
                <pre>
                    {JSON.stringify(data, null, 4)}
                </pre>
            </div>
        </>
    )
}

const collectionFetch = async function (collectionId: string)
{
    const config =
    {
        headers: { Authorization: `Bearer ${user.userToken}` }
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
    if (!res.ok) throw new Error("Failed to get collection data")
    return res.json()
}