import { Link, Outlet, FileRoute } from "@tanstack/react-router"
import { FetchCollections } from "../../fetch/FetchCollections"

export const Route = new FileRoute('/mdc/collections').createRoute({
    loader: async ({ context: { auth } }) => await FetchCollections(auth.token),
    staleTime: 20_000,
    component: Collections
})

function Collections()
{
    const data = Route.useLoaderData();
    console.log("My coll data is: ", data)

    return (
        <>
            <div>
                Collections {` `}
                {data.map((coll: any) => (
                    <Link key={coll._id}
                        to="/mdc/collections/$collectionId"
                        params={{
                            collectionId: coll._id
                        }}
                    >
                        <p>Click to load the "{coll.title} collection".</p>
                    </Link>
                ))}
                <hr />
                <Outlet />
            </div>
        </>
    )
}