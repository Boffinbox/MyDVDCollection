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
import { Button, Divider, List, Stack, Typography } from '@mui/joy'

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

    const updateRefDiscMutation = useMutation({
        mutationFn: ({ barcode, title }: { barcode: string, title: string }) => PostReference({ token, barcode, title }),
        onSuccess: (returnedRef: IReferenceDisc) =>
        {
            queryClient.setQueryData(["collections"],
                (oldData: ICollectionHydrated[]) =>
                {
                    console.log(oldData)
                    console.log(`modified ${returnedRef.barcode}`)
                    let newData = oldData;
                    let coll = newData.find(coll => coll.discs.find(disc => disc.referenceDVD._id === returnedRef._id))
                    if (coll == undefined)
                    {
                        return [...oldData]
                    }
                    let index = newData.indexOf(coll)
                    const discs: IDisc[] = coll.discs;
                    for (let i = 0; i < discs.length; i++)
                    {
                        if (discs[i].referenceDVD.barcode === returnedRef.barcode)
                        {
                            discs[i].referenceDVD.title = returnedRef.title
                        }
                    }
                    coll.discs = discs
                    newData[index] = coll
                    return [...newData]
                }
            )
        }
    })

    const deleteDiscMutation = useMutation({
        mutationFn: ({ discId, collectionId }: { discId: string, collectionId: string }) => DeleteDisc(token, collectionId, discId),
        onSuccess: (returnedDisc: IDisc) => queryClient.setQueryData(["collections"],
            (oldData: ICollectionHydrated[]) =>
            {
                let newData = oldData;
                let coll = newData.find(coll => coll.discs.find(disc => disc._id === returnedDisc._id))
                if (coll == undefined)
                {
                    return [...oldData]
                }
                let index = newData.indexOf(coll)
                coll = {
                    ...coll,
                    discs: coll.discs.filter((disc: IDisc) => disc._id !== returnedDisc._id)
                }
                newData[index] = coll
                return [...newData]
            })
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
                    {collections.map((coll: ICollectionHydrated, idx: number) =>
                    (
                        <>
                            {coll.title}
                            <Divider />
                            {coll.discs.map((disc: IDisc, idx: number) =>
                            (
                                <>
                                    {disc.referenceDVD.title === "unknown" ?
                                        <>
                                            <DiscListItem
                                                key={disc._id}
                                                title={disc.referenceDVD.title}
                                                barcode={disc.referenceDVD.barcode}
                                                discId={disc._id}
                                                deleteFn={async () => 
                                                {
                                                    await deleteDiscMutation.mutate({
                                                        discId: disc._id,
                                                        collectionId: coll._id
                                                    })
                                                }}
                                                updateRefFn={async (title: string) =>
                                                    await updateRefDiscMutation.mutate({
                                                        barcode: disc.referenceDVD.barcode,
                                                        title,
                                                    })
                                                }
                                            />
                                        </> : <></>}
                                </>
                            ))}
                        </>
                    ))}



                    {/* {unknowns.map((colldisc: [ICollectionHydrated, IDisc], idx: number) => (
                        <DiscListItem
                            key={colldisc[1]._id}
                            title={colldisc[1].referenceDVD.title}
                            barcode={colldisc[1].referenceDVD.barcode}
                            discId={colldisc[1]._id}
                            deleteFn={async () => 
                            {
                                await deleteDiscMutation.mutate({ discId: colldisc[1]._id, collectionId: colldisc[0]._id })
                            }}
                            updateRefFn={async (title: string) =>
                                await updateRefDiscMutation.mutate({
                                    barcode: colldisc[1].referenceDVD.barcode,
                                    title,
                                })
                            }
                        />
                    ))} */}
                </List>
            </Stack>
        </>
    )
}
