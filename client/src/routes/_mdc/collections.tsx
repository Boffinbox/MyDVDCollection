import { createFileRoute } from "@tanstack/react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DeleteCollection } from "../../httpverbs/DeleteCollection";
import { PostCollection } from "../../httpverbs/PostCollection";
import { PatchCollection } from "../../httpverbs/PatchCollection";

import { SingleLineForm } from "../../components/SingleLineForm";

import { AccessTokenQueryOptions, CollectionsQueryOptions } from "../../utilities/Queries"
import { ICollection } from "../../Interfaces";

import { Divider, Stack, Typography } from "@mui/joy"
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

    const updateCollectionMutation = useMutation({
        mutationFn: ({ collectionId, title }: { collectionId: string, title: string }) => PatchCollection(token, collectionId, title),
        onSuccess: (returnedCollection: ICollection) => queryClient.setQueryData(["collections"],
            (oldData: ICollection[]) =>
            {
                let newData = oldData
                let collToUpdate = newData.find(coll => coll._id === returnedCollection._id)
                if (collToUpdate == undefined)
                {
                    return newData
                }
                collToUpdate.title = returnedCollection.title
                return newData
            })
    })

    const deleteCollectionMutation = useMutation({
        mutationFn: (collectionId: string) => DeleteCollection(token, collectionId),
        onSuccess: (returnedCollection: ICollection) => queryClient.setQueryData(["collections"],
            (oldData: ICollection[]) => oldData.filter((coll: ICollection) => coll._id !== returnedCollection._id))
    })

    if (collectionsQuery.isLoading) return <Typography level="h1" sx={{ height: "100%" }}>Loading...</Typography>
    if (collectionsQuery.isError) return (
        <>
            <div>Oh no! Something went wrong...</div>
            <pre>{JSON.stringify(collectionsQuery.error.message)}</pre>
        </>
    )


    return (
        <>
            <Stack gap={1} sx={{ height: "100%" }}>
                <Typography level="h1">Collections {` `}
                    <Typography level="h4">{collectionsQuery.isFetching ? <span style={{ fontSize: "small" }}>Fetching...</span> : null}</Typography>
                </Typography>
                <Divider />
                <SingleLineForm
                    submitButtonText="Submit!"
                    labelText="Title"
                    onSubmit={async (title) => await newCollectionMutation.mutate(title)}
                />
                <Divider />
                <Stack
                    spacing={0}
                >
                    {collections.map((coll) => (
                        <CollectionCard
                            key={coll._id}
                            title={coll.title}
                            collId={coll._id}
                            deleteFn={async () => await deleteCollectionMutation.mutate(coll._id)}
                            updateCollTitleFn={async (title: string) => await updateCollectionMutation.mutate({ collectionId: coll._id, title: title })}
                        >
                        </CollectionCard>
                    ))}
                </Stack>
            </Stack>
        </>
    )
}