import { Link, Outlet, createFileRoute, useRouter } from "@tanstack/react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DeleteCollection } from "../../httpverbs/delete/DeleteCollection";
import { PostCollection } from "../../httpverbs/post/PostCollection";

import { StateChangingButton } from "../../components/StateChangingButton";
import { SingleLineForm } from "../../components/SingleLineForm";

import { CollectionsQueryOptions } from "../../queries/Collections"
import { Wait } from "../../utilities/Wait";

export const Route = createFileRoute('/_mdc/collections')({
    loader: ({ context: { auth, queryClient } }) =>
    {
        queryClient.ensureQueryData(CollectionsQueryOptions(auth.token))
    },
    component: Collections
})

function Collections()
{
    const { token } = Route.useRouteContext({ select: ({ auth }) => ({ token: auth.token }) })

    const router = useRouter();

    const queryClient = useQueryClient();

    const collectionsQuery = useQuery(CollectionsQueryOptions(token))
    const collections: [{ _id: string, title: string }] = collectionsQuery.data;

    const newCollectionMutation = useMutation({
        mutationFn: (title: string) => PostCollection(token, title),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["collections"] })
    })

    if (collectionsQuery.isLoading) return <h1>Loading...</h1>
    if (collectionsQuery.isError) return <pre>{JSON.stringify(collectionsQuery.error)}</pre>

    return (
        <>
            <h2>Collections {collectionsQuery.isFetching ? <span style={{ fontSize: "small" }}>Fetching...</span> : null}</h2>
            <SingleLineForm
                submitButtonText="Submit!"
                labelText="Title"
                onSubmit={async (title) => await newCollectionMutation.mutate(title)}
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
                            onSubmit={async () => await DeleteCollection(token, coll._id)}
                        />
                    </div>
                ))}
                <hr />
                <Outlet />
            </div>
        </>
    )
}