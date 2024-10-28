import { createFileRoute } from '@tanstack/react-router'
import { DeleteDisc } from '../../httpverbs/DeleteDisc'
import { PostReference } from '../../httpverbs/PostReference'
import { SingleLineForm } from '../../components/SingleLineForm'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import
{
    AccessTokenQueryOptions,
    CollectionsQueryOptions,
} from '../../utilities/Queries'
import
{
    ICollection,
    ICollectionHydrated,
    IDisc,
    IReferenceDisc,
} from '../../Interfaces'
import { DiscListItem } from '../../components/DiscListItem'
import { Divider, List, Stack, Typography } from '@mui/joy'

export const Route = createFileRoute('/_mdc/unknowns')({
    component: UnknownCollection,
})

function UnknownCollection()
{
    const queryClient = useQueryClient()

    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data

    const collectionsQuery = useQuery(CollectionsQueryOptions(token))
    const allDiscs: ICollectionHydrated[] = collectionsQuery.data
    let unknowns: IDisc[] = []
    for (let i = 0; i < allDiscs.length; i++)
    {
        for (let j = 0; j < allDiscs[i].discs.length; j++)
        {
            if (allDiscs[i].discs[j].referenceDVD.title === 'unknown')
            {
                unknowns.push(allDiscs[i].discs[j])
            }
        }
    }

    const updateRefDiscMutation = useMutation({
        mutationFn: ({ barcode, title }: { barcode: string; title: string }) =>
            PostReference({ token, barcode, title }),
        onSuccess: (returnedRef: IReferenceDisc) =>
        {
            // queryClient.setQueryData(
            //     ['collection', collectionId],
            //     (oldData: ICollectionHydrated) =>
            //     {
            //         console.log(oldData)
            //         console.log(`modified ${returnedRef.barcode}`)
            //         const discs: IDisc[] = oldData.discs
            //         for (let i = 0; i < discs.length; i++)
            //         {
            //             if (discs[i].referenceDVD.barcode === returnedRef.barcode)
            //             {
            //                 discs[i].referenceDVD.title = returnedRef.title
            //             }
            //         }
            //         return {
            //             ...oldData,
            //             discs: [...discs],
            //         }
            //     },
            // )
        },
    })

    const deleteDiscMutation = useMutation({
        mutationFn: ({
            collectionId,
            discId,
        }: {
            collectionId: string
            discId: string
        }) => DeleteDisc(token, collectionId, discId),
        onSuccess: (returnedDisc: IDisc) =>
        {
            // queryClient.setQueryData(
            //     ['collection', collectionId],
            //     (oldData: ICollectionHydrated) =>
            //     {
            //         return {
            //             ...oldData,
            //             discs: oldData.discs.filter(
            //                 (disc: IDisc) => disc._id !== returnedDisc._id,
            //             ),
            //         }
            //     },
            // )
        },
    })

    if (collectionsQuery.isLoading)
        return (
            <Typography level="h1" sx={{ height: '100%' }}>
                Loading...
            </Typography>
        )
    if (collectionsQuery.isError)
        return (
            <>
                <div>Oh no! Something went wrong...</div>
                <pre>{JSON.stringify(collectionsQuery.error.message)}</pre>
            </>
        )

    return (
        <>
            <Stack gap={1} sx={{ height: '100%' }}>
                <Typography level="h1">
                    Unknowns
                    {` `}
                    <Typography level="h4">
                        {collectionsQuery.isFetching ? (
                            <span style={{ fontSize: 'small' }}>Fetching...</span>
                        ) : null}
                    </Typography>
                </Typography>
                <Divider />
                <List>
                    {unknowns.map((disc: IDisc, idx: number) => (
                        <DiscListItem
                            key={disc._id}
                            title={disc.referenceDVD.title}
                            barcode={disc.referenceDVD.barcode}
                            discId={disc._id}
                            deleteFn={() => console.log("not deleted")}
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
