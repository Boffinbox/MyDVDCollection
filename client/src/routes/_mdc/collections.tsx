import { Link as RouterLink, Outlet, createFileRoute } from "@tanstack/react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DeleteCollection } from "../../httpverbs/DeleteCollection";
import { PostCollection } from "../../httpverbs/PostCollection";

import { StateChangingButton } from "../../components/StateChangingButton";
import { SingleLineForm } from "../../components/SingleLineForm";

import { AccessTokenQueryOptions, CollectionsQueryOptions } from "../../utilities/Queries"
import { ICollection } from "../../Interfaces";

import { Sheet, Typography, ButtonGroup, Button, Link, Divider } from "@mui/joy"

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
            <SingleLineForm
                submitButtonText="Submit!"
                labelText="Title"
                onSubmit={async (title) => await newCollectionMutation.mutate(title)}
            />
            <div>
                <p>{` `}</p>
                {collections.map((coll) => (
                    <div key={coll._id}>
                        <RouterLink
                            to="/collections/$collectionId"
                            params={{
                                collectionId: coll._id
                            }}
                        >
                            Click to load the "{coll.title} collection".
                        </RouterLink>
                        {` `}
                        <StateChangingButton
                            text={"Delete..."}
                            onSubmit={async () => await deleteCollectionMutation.mutate(coll._id)}
                        />
                    </div>
                ))}
                <hr />
                <Outlet />
            </div>
        </>
    )
}