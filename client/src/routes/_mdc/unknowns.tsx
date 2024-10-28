import { createFileRoute } from '@tanstack/react-router'
import { DeleteDisc } from '../../httpverbs/DeleteDisc'
import { PostReference } from '../../httpverbs/PostReference'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useState } from "react";
import
{
    AccessTokenQueryOptions,
    CollectionsQueryOptions,
} from '../../utilities/Queries'
import
{
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
    const collections: ICollectionHydrated[] = collectionsQuery.data

    const [unknowns, setUnknowns] = useState(getCurrentUnknowns(collections))

    function getCurrentUnknowns(collections: ICollectionHydrated[]): IDisc[]
    {
        let unknowns: IDisc[] = []
        for (let i = 0; i < collections.length; i++)
        {
            for (let j = 0; j < collections[i].discs.length; j++)
            {
                if (collections[i].discs[j].referenceDVD.title === 'unknown')
                {
                    unknowns.push(collections[i].discs[j])
                }
            }
        }
        return unknowns
    }

    const updateRefDiscMutation = useMutation({
        mutationFn: ({ barcode, title }: { barcode: string; title: string }) =>
            PostReference({ token, barcode, title }),
        onSuccess: (returnedRef: IReferenceDisc) =>
        {
            setUnknowns((oldData) =>
            {
                for (let i = 0; i < oldData.length; i++)
                {
                    if (oldData[i].referenceDVD.barcode === returnedRef.barcode)
                    {
                        oldData[i].referenceDVD.title = returnedRef.title
                    }
                }
                return oldData
            })
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
