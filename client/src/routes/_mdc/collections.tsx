import { Link, Outlet, createFileRoute, useRouter } from "@tanstack/react-router"
import { useQuery, useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { GetCollections } from "../../httpverbs/get/GetCollections"
import { DeleteCollection } from "../../httpverbs/delete/DeleteCollection";
import { PostCollection } from "../../httpverbs/post/PostCollection";

import { StateChangingButton } from "../../components/StateChangingButton";
import { SingleLineForm } from "../../components/SingleLineForm";

import { CollectionsQueryOptions } from "../../queries/Collections"
import { Suspense } from "react";

export const Route = createFileRoute('/_mdc/collections')({
    loader: async ({ context: { auth, queryClient } }) =>
    {
        await queryClient.ensureQueryData(CollectionsQueryOptions(auth.token))
    },
    component: Collections
})

function Collections()
{
    const { token } = Route.useRouteContext({ select: ({ auth }) => ({ token: auth.token }) })

    const router = useRouter();

    const collectionsQuery = useSuspenseQuery(CollectionsQueryOptions(token))
    const collections: [{ _id: string, title: string }] = collectionsQuery.data;

    return (
        <>
            <Suspense fallback={<h1>Loading...</h1>}>
                <SingleLineForm
                    submitButtonText="Submit!"
                    labelText="Title"
                    toServer={async (title) => await PostCollection(token, title)}
                    toClient={() => 
                    {
                        console.log("invalidating router...")
                        router.invalidate()
                    }}
                />
                <div>
                    Collections {` `}
                    {collections.map((coll) => (
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
                            <StateChangingButton
                                text={"Delete..."}
                                toServer={async () => await DeleteCollection(token, coll._id)}
                                toClient={() => router.invalidate()}
                            />
                        </div>
                    ))}
                    <hr />
                    <Outlet />
                </div>
            </Suspense>
        </>
    )
}