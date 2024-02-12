import { createFileRoute } from "@tanstack/react-router"
import { DeleteDisc } from "../../httpverbs/DeleteDisc";
import { PostBarcode } from "../../httpverbs/PostBarcode";
import { SingleLineForm } from "../../components/SingleLineForm";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { AccessTokenQueryOptions, CollectionQueryOptions } from "../../utilities/Queries";
import { ICollectionHydrated, IDisc } from "../../Interfaces";
import { DiscListItem } from "../../components/DiscListItem";
import { Divider, List, Stack, Typography } from "@mui/joy";

export const Route = createFileRoute('/_mdc/collections/$collectionId')({
    component: Collection
})

function Collection()
{
    const { collectionId } = Route.useParams();

    const queryClient = useQueryClient();

    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data;

    const collectionQuery = useQuery(CollectionQueryOptions(token, collectionId))
    const collection: ICollectionHydrated = collectionQuery.data;

    const newDiscMutation = useMutation({
        mutationFn: (barcode: string) => PostBarcode(token, collectionId, barcode),
        onSuccess: (returnedDisc: IDisc) =>
        {
            console.log("received data was: ", returnedDisc)
            console.log("coll id is: ", collectionId)
            queryClient.setQueryData(["collection", collectionId],
                (oldData: ICollectionHydrated) =>
                {
                    console.log(oldData)
                    return {
                        ...oldData,
                        discs: [...oldData.discs, returnedDisc]
                    }
                }
            )
        }
    })

    const deleteDiscMutation = useMutation({
        mutationFn: (discId: string) => DeleteDisc(token, collectionId, discId),
        onSuccess: (returnedDisc: IDisc) => queryClient.setQueryData(["collection", collectionId],
            (oldData: ICollectionHydrated) =>
            {
                return {
                    ...oldData,
                    discs: oldData.discs.filter((disc: IDisc) => disc._id !== returnedDisc._id)
                }

            })
    })

    if (collectionQuery.isLoading) return <Typography level="h1">Loading...</Typography>
    if (collectionQuery.isError) return (
        <>
            <div>Oh no! Something went wrong...</div>
            <pre>{JSON.stringify(collectionQuery.error.message)}</pre>
        </>
    )

    return (
        <>
            <Stack gap={1}>
                <Typography level="h1">{collection.title}{` `}
                    <Typography level="h4">{collectionQuery.isFetching ? <span style={{ fontSize: "small" }}>Fetching...</span> : null}</Typography>
                </Typography>
                <Divider />
                <SingleLineForm
                    submitButtonText="Submit!"
                    labelText="Barcode"
                    onSubmit={async (barcode) => await newDiscMutation.mutate(barcode)}
                />
                <List>
                    {collection.discs.map((disc: IDisc, idx: number) => (
                        <DiscListItem
                            key={disc._id}
                            title={disc.referenceDVD.title}
                            barcode={disc.referenceDVD.barcode}
                            discId={disc._id}
                            deleteFn={async () => await deleteDiscMutation.mutate(disc._id)} />
                    ))}
                </List>
            </Stack>
        </>
    )
}