import { createFileRoute } from "@tanstack/react-router"
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

import { DeleteCollection } from "../../httpverbs/DeleteCollection";
import { PostCollection } from "../../httpverbs/PostCollection";
import { PatchCollection } from "../../httpverbs/PatchCollection";

import { SingleLineForm } from "../../components/SingleLineForm";

import
{
    AccessTokenQueryOptions,
    CollectionsQueryOptions,
    CollectionQueryOptions
} from "../../utilities/Queries"
import { ICollection } from "../../Interfaces";

import { Divider, Stack, Typography } from "@mui/joy"
import { CollectionCard } from "../../components/CollectionCard";
import { useContext } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ScrollContext } from '../../components/ScrollContextProvider'

export const Route = createFileRoute('/_mdc/collections')({
    beforeLoad: async ({ context: { queryClient } }) =>
    {
        const token = await queryClient.ensureQueryData(AccessTokenQueryOptions())
        await queryClient.ensureQueryData(CollectionsQueryOptions(token))
    },
    component: Collections
})

function Collections()
{
    const queryClient = useQueryClient();

    const token: string | undefined = queryClient.getQueryData(["accesstoken"])

    const collectionListQuery = useQuery(CollectionsQueryOptions(token))
    const collectionList: string[] = collectionListQuery.data

    const collectionsQueries = useQueries({
        queries: collectionList.map((id) => (CollectionQueryOptions(token, id)))
    })

    const collections: ICollection[] = collectionsQueries.map((query) => query.data)

    const scrollContext = useContext(ScrollContext)

    const virtualizer = useVirtualizer(
        {
            count: collections!.length,
            estimateSize: () => 320,
            getScrollElement: () => scrollContext.scrollRef.current,
            overscan: 4
        }
    )

    const virtualItems = virtualizer.getVirtualItems()

    const newCollectionMutation = useMutation({
        mutationFn: (title: string) => PostCollection(token, title),
        onSuccess: (returnedCollection: ICollection) =>
        {
            queryClient.setQueryData(["collection", returnedCollection._id], returnedCollection)
            queryClient.setQueryData(["collections"], (oldData: ICollection[]) => [...oldData, returnedCollection._id])
        }
    })

    const updateCollectionMutation = useMutation({
        mutationFn: ({ collectionId, title }: { collectionId: string, title: string }) => PatchCollection(token, collectionId, title),
        onSuccess: (returnedCollection: ICollection) =>
        {
            queryClient.setQueryData(["collection", returnedCollection._id], returnedCollection)
        }
    })

    const deleteCollectionMutation = useMutation({
        mutationFn: (collectionId: string) => DeleteCollection(token, collectionId),
        onSuccess: (returnedCollection: ICollection) =>
        {
            queryClient.setQueryData(["collections"],
                (oldData: string[]) =>
                {
                    return oldData.filter((collId: string) => collId !== returnedCollection._id)
                })
            queryClient.removeQueries({ queryKey: ["collection", returnedCollection._id] })
        }
    })

    if (collectionListQuery.isLoading) return <Typography level="h1" sx={{ height: "100%" }}>Loading...</Typography>
    if (collectionListQuery.isError) return (
        <>
            <div>Oh no! Something went wrong...</div>
            <pre>{JSON.stringify(collectionListQuery.error.message)}</pre>
        </>
    )

    for (let query of collectionsQueries)
    {
        if (query.isLoading) return <Typography level="h1" sx={{ height: "100%" }}>Loading...</Typography>
        if (query.isError) return (
            <>
                <div>Oh no! Something went wrong...</div>
                <pre>{JSON.stringify(query.error.message)}</pre>
            </>
        )
    }

    return (
        <>
            <Stack gap={1} sx={{ height: "100%" }}>
                <Typography level="h1">Collections {` `}
                    <Typography level="h4">{collectionListQuery.isFetching ? <span style={{ fontSize: "small" }}>Fetching...</span> : null}</Typography>
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
                    <div style={{
                        position: "relative",
                        height: `${virtualizer.getTotalSize()}px`,
                    }}>
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
                            }}
                        >
                            {virtualItems.map((vItem) =>
                            {
                                const coll = collections[vItem.index]
                                return (
                                    <div
                                        key={vItem.key}
                                        data-index={vItem.index}
                                        ref={virtualizer.measureElement}
                                    >
                                        <CollectionCard
                                            key={coll._id}
                                            title={coll.title}
                                            collId={coll._id}
                                            deleteFn={async () => await deleteCollectionMutation.mutate(coll._id)}
                                            updateCollTitleFn={async (title: string) => await updateCollectionMutation.mutate({ collectionId: coll._id, title: title })}
                                            discCount={coll.discs.length}
                                        >
                                        </CollectionCard>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                </Stack>
            </Stack>
        </>
    )
}