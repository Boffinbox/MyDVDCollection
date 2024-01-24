import { Link, Outlet, FileRoute } from "@tanstack/react-router"
import { GetCollections } from "../../httpverbs/get/GetCollections"

export const Route = new FileRoute('/_mdc/collections').createRoute({
    loader: async ({ context: { auth } }) => await GetCollections(auth.token),
    staleTime: 20_000,
    component: Collections
})

function Collections()
{
    const data: [{ _id: string, title: string }] = Route.useLoaderData();
    console.log("My coll data is: ", data)

    return (
        <>
            <div>
                Collections {` `}
                {data.map((coll) => (
                    <div key={coll._id}>
                        <Link
                            to="/collections/$collectionId"
                            params={{
                                collectionId: coll._id
                            }}
                        >
                            Click to load the "{coll.title} collection".
                        </Link>
                        {` `}
                        <button>
                            Delete!
                        </button>
                    </div>
                ))}
                <hr />
                <Outlet />
            </div>
        </>
    )
}