import { Link, Outlet, FileRoute, useRouter } from "@tanstack/react-router"
import { GetCollections } from "../../httpverbs/get/GetCollections"
import { DeleteCollection } from "../../httpverbs/delete/DeleteCollection";
import { DeleteButton } from "../../components/DeleteButton";

export const Route = new FileRoute('/_mdc/collections').createRoute({
    loader: async ({ context: { auth } }) => await GetCollections(auth.token),
    component: Collections
})

function Collections()
{
    const { token } = Route.useRouteContext({ select: ({ auth }) => ({ token: auth.token }) })

    const router = useRouter();

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
                        <DeleteButton
                            deleteFromServer={async () => await DeleteCollection(token, coll._id)}
                            deleteFromClient={() => router.invalidate()}
                        />
                    </div>
                ))}
                <hr />
                <Outlet />
            </div>
        </>
    )
}