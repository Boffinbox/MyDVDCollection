import { createFileRoute } from '@tanstack/react-router'
import { DeleteDisc } from '../../httpverbs/DeleteDisc'
import { PostBarcode } from '../../httpverbs/PostBarcode'
import { PostReference } from '../../httpverbs/PostReference'
import { SingleLineForm } from '../../components/SingleLineForm'
import { useQueryClient, useQuery, useQueries, useMutation } from '@tanstack/react-query'
import
{
    AccessTokenQueryOptions,
    CollectionQueryOptions,
    CollectionsQueryOptions,
    DiscQueryOptions
} from '../../utilities/Queries'
import { ICollection, IDisc, IReferenceDisc } from '../../Interfaces'
import { DiscListItem } from '../../components/DiscListItem'
import { Divider, List, Sheet, Stack, Typography } from '@mui/joy'

export const Route = createFileRoute('/_mdc/collections_/$collectionId')({
    beforeLoad: async ({ context: { queryClient }, params }) =>
    {
        const token = await queryClient.ensureQueryData(AccessTokenQueryOptions())
        await queryClient.ensureQueryData(CollectionQueryOptions(token, params.collectionId))
    },
    component: Collection
})

function Collection()
{
    const { collectionId } = Route.useParams()

    const queryClient = useQueryClient()

    const token: string | undefined = queryClient.getQueryData(["accesstoken"])

    const collection: ICollection | undefined = queryClient.getQueryData(["collection", collectionId])

    if (collection == undefined)
    {
        return (
            <>
                <div>Oh no! Something went wrong...</div>
                <pre>{"404: No collection found at this URL."}</pre>
            </>
        )
    }

    const newDiscMutation = useMutation({
        mutationFn: (discId: string) => PostBarcode(token, collectionId, discId),
        onSuccess: (returnedDisc: IDisc) =>
        {
            queryClient.setQueryData(['collection', collectionId],
                (oldData: ICollection) =>
                {
                    oldData.discs.push(returnedDisc._id)
                    return oldData
                })
        },
    })

    const updateRefDiscMutation = useMutation({
        mutationFn: ({ discId, title }: { discId: string; title: string }) =>
        {
            let discData: IDisc = queryClient.getQueryData(["disc", discId])!
            let refId = discData.referenceDVD
            let refData: IReferenceDisc = queryClient.getQueryData(["reference", refId])!
            let barcode = refData.barcode
            return PostReference({ token, barcode, title })
        },
        onSuccess: (returnedRef: IReferenceDisc) =>
        {
            queryClient.setQueryData(["reference", returnedRef._id],
                (oldData: IReferenceDisc) =>
                {
                    oldData.title = returnedRef.title
                }
            )
        }
    })

    const deleteDiscMutation = useMutation({
        mutationFn: (discId: string) => DeleteDisc(token, collectionId, discId),
        onSuccess: (returnedDisc: IDisc) =>
        {
            queryClient.setQueryData(["collection", collectionId],
                (oldData: ICollection) =>
                {
                    oldData.discs = oldData.discs.filter((discId: string) => discId !== returnedDisc._id)
                    return oldData
                })
            queryClient.removeQueries({ queryKey: ["disc", returnedDisc._id] })
        }
    })

    // for (let query of discQueries)
    // {
    //     if (query.isLoading) return <Typography level="h1" sx={{ height: "100%" }}>Loading...</Typography>
    //     if (query.isError) return (
    //         <>
    //             <div>Oh no! Something went wrong...</div>
    //             <pre>{JSON.stringify(query.error.message)}</pre>
    //         </>
    //     )
    // }

    return (
        <>
            <Stack gap={1} sx={{ height: '100%' }}>
                <Stack direction="row" gap={1} sx=
                    {{
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                    <Typography level="h1">
                        {collection.title}
                        {` `}
                        {/* <Typography level="h4">
                            {collectionQuery.isFetching ? (
                                <span style={{ fontSize: 'small' }}>Fetching...</span>
                            ) : null}
                        </Typography> */}
                    </Typography>
                    <Typography level="h4">
                        Disc count:{` `}
                        {collection.discs.length}
                    </Typography>
                </Stack>
                <Divider />
                <SingleLineForm
                    submitButtonText="Submit!"
                    labelText="Barcode"
                    onSubmit={async (barcode) => await newDiscMutation.mutate(barcode)}
                />
                <List>
                    {collection.discs.map((disc: string) => (
                        <DiscListItem
                            key={disc}
                            discId={disc}
                            collectionId={collectionId}
                            deleteFn={async () => await deleteDiscMutation.mutate(disc)}
                            updateRefFn={async (title: string) => await updateRefDiscMutation.mutate({ discId: disc, title })}
                        />
                    ))}
                </List>
            </Stack>
        </>
    )
}
