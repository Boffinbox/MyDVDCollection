import { createFileRoute } from "@tanstack/react-router"
import { DeleteDisc } from "../../httpverbs/delete/DeleteDisc";
import { PostBarcode } from "../../httpverbs/post/PostBarcode";
import { StateChangingButton } from "../../components/StateChangingButton";
import { SingleLineForm } from "../../components/SingleLineForm";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { CollectionQueryOptions } from "../../queries/Collections";

export const Route = createFileRoute('/_mdc/collections/$collectionId')({
    loader: async ({ params: { collectionId }, context: { auth, queryClient } }) =>
    {
        queryClient.ensureQueryData(CollectionQueryOptions(auth.token, collectionId))
    },
    component: Collection
})

function Collection()
{
    const { token } = Route.useRouteContext({ select: ({ auth }) => ({ token: auth.token }) })

    const { collectionId } = Route.useParams();

    const queryClient = useQueryClient();

    const collectionQuery = useQuery(CollectionQueryOptions(token, collectionId))
    const collection: any = collectionQuery.data;

    const newDiscMutation = useMutation({
        mutationFn: (barcode: string) => PostBarcode(token, collectionId, barcode),
        onSuccess: (data: any) =>
        {
            console.log("received data was: ", data)
            console.log("coll id is: ", collectionId)
            queryClient.setQueryData(["collection", collectionId],
                (oldData: any) =>
                {
                    console.log(oldData)
                    return {
                        ...oldData,
                        discs: [...oldData.discs, data]
                    }
                }
            )
        }
    })

    const deleteDiscMutation = useMutation({
        mutationFn: (discId: string) => DeleteDisc(token, collectionId, discId),
        onSuccess: (data: any) => queryClient.setQueryData(["collection", collectionId],
            (oldData: any) =>
            {
                return {
                    ...oldData,
                    discs: oldData.discs.filter((coll: any) => coll._id !== data._id)
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
                {collection.discs.map((disc: any, idx: any) => (
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