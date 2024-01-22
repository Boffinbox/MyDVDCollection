import { Link, Outlet, FileRoute } from "@tanstack/react-router"
import { FetchCollections } from "../utilities/FetchCollections"

export const Route = new FileRoute('/collections').createRoute({
    loader: async ({ context: { auth } }) => await FetchCollections(auth.token),
    component: Collections
})

function Collections()
{
    const data = Route.useLoaderData();
    console.log("My coll data is: ", data)

    return (
        <>
            <div>
                {JSON.stringify(data, null, 4)}
                Collections {` `}
                <Link
                    to="/collections/$collectionId"
                    params={{
                        collectionId: "6557a7fe22dd6bff7082b921"
                    }}
                >Click to load example collection.</Link>
                <hr />
                <Outlet />
            </div>
        </>
    )
}