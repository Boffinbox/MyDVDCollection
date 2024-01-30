import { createFileRoute } from "@tanstack/react-router"
import { DeleteDisc } from "../../httpverbs/DeleteDisc";
import { PostBarcode } from "../../httpverbs/PostBarcode";
import { StateChangingButton } from "../../components/StateChangingButton";
import { SingleLineForm } from "../../components/SingleLineForm";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { AccessTokenQueryOptions, CollectionQueryOptions } from "../../utilities/Queries";
import { ICollectionHydrated, IDisc } from "../../Interfaces";

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

    if (collectionQuery.isLoading) return <h1>Loading...</h1>
    if (collectionQuery.isError) return <pre>{JSON.stringify(collectionQuery.error)}</pre>

    return (
        <>
            <h3>{collection.title}{` `}{collectionQuery.isFetching ? <span style={{ fontSize: "small" }}>Fetching...</span> : null}</h3>
            <SingleLineForm
                submitButtonText="Submit!"
                labelText="Barcode"
                onSubmit={async (barcode) => await newDiscMutation.mutate(barcode)}
            />
            <div>
                {collection.discs.map((disc: IDisc, idx: number) => (
                    <div key={disc._id}>
                        Disc {idx + 1}: Barcode: {disc.referenceDVD.barcode}, {disc.referenceDVD.title}
                        {` `}
                        <StateChangingButton
                            text={"Delete..."}
                            onSubmit={async () => await deleteDiscMutation.mutate(disc._id)}
                        />
                    </div>
                ))}
            </div >
        </>
    )
}