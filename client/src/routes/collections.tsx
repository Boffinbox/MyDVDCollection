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
                Collections {` `}
                {data.map((coll: any) => (
                    <p>
                        <Link
                            to="/collections/$collectionId"
                            params={{
                                collectionId: coll._id
                            }}
                        >Click to load the "{coll.title} collection".
                        </Link>
                    </p>
                ))}
                <hr />
                <Outlet />
            </div>
        </>
    )
}