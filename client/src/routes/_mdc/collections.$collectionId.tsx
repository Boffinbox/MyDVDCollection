import { FileRoute } from "@tanstack/react-router"
import { FetchCollection } from "../../fetch/FetchCollection";

export const Route = new FileRoute('/_mdc/collections/$collectionId').createRoute({
    loader: async ({ params: { collectionId }, context: { auth } }) => FetchCollection(collectionId, auth.token),
    component: Collection
})

function Collection()
{
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