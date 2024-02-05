import { Outlet, createFileRoute } from "@tanstack/react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DeleteCollection } from "../../httpverbs/DeleteCollection";
import { PostCollection } from "../../httpverbs/PostCollection";

import { SingleLineForm } from "../../components/SingleLineForm";

import { AccessTokenQueryOptions, CollectionsQueryOptions } from "../../utilities/Queries"
import { ICollection } from "../../Interfaces";

import { Divider, Stack } from "@mui/joy"
import { CollectionCard } from "../../components/CollectionCard";

export const Route = createFileRoute('/_mdc/collections')({
    component: Collections
})

function Collections()
{
    const queryClient = useQueryClient();

    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data;

    const collectionsQuery = useQuery(CollectionsQueryOptions(token))
    const collections: [{ _id: string, title: string }] = collectionsQuery.data;

    const newCollectionMutation = useMutation({
        mutationFn: (title: string) => PostCollection(token, title),
        onSuccess: (returnedCollection: ICollection) => queryClient.setQueryData(["collections"],
            (oldData: ICollection[]) => [...oldData, returnedCollection])
    })

    const deleteCollectionMutation = useMutation({
        mutationFn: (collectionId: string) => DeleteCollection(token, collectionId),
        onSuccess: (returnedCollection: ICollection) => queryClient.setQueryData(["collections"],
            (oldData: ICollection[]) => oldData.filter((coll: ICollection) => coll._id !== returnedCollection._id))
    })

    if (collectionsQuery.isLoading) return <h1>Loading...</h1>
    if (collectionsQuery.isError) return (
        <>
            <div>Oh no! Something went wrong...</div>
            <pre>{JSON.stringify(collectionsQuery.error.message)}</pre>
        </>
    )


    return (
        <>
            <h2>Collections {collectionsQuery.isFetching ? <span style={{ fontSize: "small" }}>Fetching...</span> : null}</h2>
            <Divider />
            <SingleLineForm
                submitButtonText="Submit!"
                labelText="Title"
                onSubmit={async (title) => await newCollectionMutation.mutate(title)}
            />
            <Divider />
            <Stack
                spacing={2}
            >
                {collections.map((coll) => (
                    <CollectionCard
                        key={coll._id}
                        title={coll.title}
                        collId={coll._id}
                        deleteFn={async () => await deleteCollectionMutation.mutate(coll._id)}
                    >
                    </CollectionCard>
                ))}
            </Stack>
            <Divider />
            <Outlet />
        </>
    )
}