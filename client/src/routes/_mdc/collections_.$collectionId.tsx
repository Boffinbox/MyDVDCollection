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

    const discQueries = useQueries({
        queries: collection.discs.map((discId: string) => DiscQueryOptions(token, collectionId, discId))
    })

    const discs: IDisc[] = discQueries.map((query) => query.data)

    // return (
    //     <pre>
    //         {JSON.stringify(discs)}
    //     </pre>
    // )

    // const newDiscMutation = useMutation({
    //     mutationFn: (barcode: string) => PostBarcode(token, collectionId, barcode),
    //     onSuccess: (returnedDisc: IDisc) =>
    //     {
    //         console.log('new disc received data was: ', returnedDisc)
    //         console.log('coll id is: ', collectionId)
    //         queryClient.setQueryData(
    //             ['collections'],
    //             (oldData: ICollectionHydrated[]) =>
    //             {
    //                 let newData = oldData
    //                 let coll = newData.find((coll) => coll._id === collectionId)
    //                 if (coll == undefined)
    //                 {
    //                     return [...oldData]
    //                 }
    //                 let index = newData.indexOf(coll)
    //                 coll = {
    //                     ...coll,
    //                     discs: [...coll.discs, returnedDisc],
    //                 }
    //                 newData[index] = coll
    //                 return [...newData]
    //             },
    //         )
    //     },
    // })

    // const updateRefDiscMutation = useMutation({
    //     mutationFn: ({ barcode, title }: { barcode: string; title: string }) =>
    //         PostReference({ token, barcode, title }),
    //     onSuccess: (returnedRef: IReferenceDisc) =>
    //     {
    //         queryClient.setQueryData(
    //             ['collections'],
    //             (oldData: ICollectionHydrated[]) =>
    //             {
    //                 console.log(oldData)
    //                 console.log(`modified ${returnedRef.barcode}`)
    //                 let newData = oldData
    //                 let coll = newData.find((coll) => coll._id === collectionId)
    //                 if (coll == undefined)
    //                 {
    //                     return [...oldData]
    //                 }
    //                 let index = newData.indexOf(coll)
    //                 const discs: IDisc[] = coll.discs
    //                 for (let i = 0; i < discs.length; i++)
    //                 {
    //                     if (discs[i].referenceDVD.barcode === returnedRef.barcode)
    //                     {
    //                         discs[i].referenceDVD.title = returnedRef.title
    //                         discs[i].referenceDVD.upcitemdb_truedata =
    //                             returnedRef.upcitemdb_truedata
    //                     }
    //                 }
    //                 coll.discs = discs
    //                 newData[index] = coll
    //                 return [...newData]
    //             },
    //         )
    //     },
    // })

    // const deleteDiscMutation = useMutation({
    //     mutationFn: (discId: string) => DeleteDisc(token, collectionId, discId),
    //     onSuccess: (returnedDisc: IDisc) =>
    //         queryClient.setQueryData(
    //             ['collections'],
    //             (oldData: ICollectionHydrated[]) =>
    //             {
    //                 let newData = oldData
    //                 let coll = newData.find((coll) => coll._id === collectionId)
    //                 if (coll == undefined)
    //                 {
    //                     return [...oldData]
    //                 }
    //                 let index = newData.indexOf(coll)
    //                 coll = {
    //                     ...coll,
    //                     discs: coll.discs.filter(
    //                         (disc: IDisc) => disc._id !== returnedDisc._id,
    //                     ),
    //                 }
    //                 newData[index] = coll
    //                 return [...newData]
    //             },
    //         ),
    // })

    for (let query of discQueries)
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
                    {discs.map((disc: IDisc) => (
                        <DiscListItem
                            key={disc._id}
                            title={disc.referenceDVD.title}
                            barcode={disc.referenceDVD.barcode}
                            collectionId={collection._id}
                            discId={disc._id}
                            trueData={disc.referenceDVD.upcitemdb_truedata}
                            imageLink={`disc.referenceDVD.images[0]`}
                            deleteFn={async () => await deleteDiscMutation.mutate(disc._id)}
                            updateRefFn={async (title: string) =>
                                await updateRefDiscMutation.mutate({
                                    barcode: disc.referenceDVD.barcode,
                                    title,
                                })
                            }
                        />
                    ))}
                </List>
            </Stack>
        </>
    )
}
