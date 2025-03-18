import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useContext, useState } from "react";
import
{
    AccessTokenQueryOptions,
    UnknownsQueryOptions
} from '../../utilities/Queries'
import
{
    ICollection,
    IDisc,
    IReferenceDisc,
} from '../../Interfaces'
import { DiscListItem } from '../../components/DiscListItem'
import { Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemDecorator, Modal, ModalDialog, Sheet, Stack, Typography } from '@mui/joy'
import { Edit, InfoOutlined } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete';
import { SingleLineForm } from '../../components/SingleLineForm';
import { PostReference } from '../../httpverbs/PostReference';
import { DeleteDisc } from '../../httpverbs/DeleteDisc';
import { ScrollContext } from '../../components/ScrollContextProvider'
import { useVirtualizer, VirtualItem, Virtualizer } from '@tanstack/react-virtual';

export const Route = createFileRoute('/_mdc/unknowns')({
    beforeLoad: async ({ context: { queryClient } }) =>
    {
        const token = await queryClient.ensureQueryData(AccessTokenQueryOptions())
        await queryClient.ensureQueryData(UnknownsQueryOptions(token))
    },
    component: UnknownCollection,
})

function UnknownCollection()
{
    const queryClient = useQueryClient()

    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data

    const unknownsQuery = useQuery(UnknownsQueryOptions(token))
    const unknowns = unknownsQuery.data

    // convert these unknowns into a simple array, with titles and discs

    const data = []
    for (let coll of unknowns)
    {
        data.push(coll.title)
        for (let disc of coll.discs)
        {
            disc.collId = coll._id
            data.push(disc)
        }
    }

    const [open, setOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [modalDisc, setModalDisc] = useState<{ id: string, title: string, collId: string }>({ id: "undefined", title: "undefined", collId: "undefined" })

    const scrollContext = useContext(ScrollContext)

    const virtualizer = useVirtualizer(
        {
            count: data.length,
            estimateSize: () => 70,
            getScrollElement: () => scrollContext.scrollRef.current,
            overscan: 4
        }
    )
    const virtualItems = virtualizer.getVirtualItems()

    const updateRefDiscMutation = useMutation({
        mutationFn: ({ discId, title }: { discId: string, title: string }) =>
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
            setModalDisc({ id: modalDisc.id, title: returnedRef.title, collId: modalDisc.id })
        }
    })

    const deleteDiscMutation = useMutation({
        mutationFn: ({ discId, collId }: { discId: string, collId: string }) => DeleteDisc(token, collId, discId),
        onSuccess: (returnedDisc: IDisc) =>
        {
            queryClient.setQueryData(["unknowns"],
                (oldData: ICollection[]) =>
                {
                    let index = oldData.findIndex((coll) => coll._id === modalDisc.collId)
                    if (index == -1)
                    {
                        return oldData
                    }
                    oldData[index].discs = oldData[index].discs.filter((disc: any) => disc._id !== returnedDisc._id)
                    return oldData
                })
            queryClient.removeQueries({ queryKey: ["disc", returnedDisc._id] })
            queryClient.invalidateQueries({ queryKey: ["collection", modalDisc.collId] })
        }
    })

    function drawerFunction(discId: string, collId: string)
    {
        setOpen(true)
        const discData: IDisc = queryClient.getQueryData(["disc", discId])!
        const refData: IReferenceDisc = queryClient.getQueryData(["reference", discData.referenceDVD])!
        setModalDisc({ id: discData._id, title: refData.title, collId })
    }

    function deleteDisc()
    {
        setOpen(false)
        setIsEditModalOpen(false)
        setIsDeleteModalOpen(false)
        deleteDiscMutation.mutate({ discId: modalDisc.id, collId: modalDisc.collId })
    }

    if (unknownsQuery.isLoading)
        return (
            <Typography level="h1" sx={{ height: '100%' }}>
                Loading...
            </Typography>
        )
    if (unknownsQuery.isError)
        return (
            <>
                <div>Oh no! Something went wrong...</div>
                <pre>{JSON.stringify(unknownsQuery.error.message)}</pre>
            </>
        )

    return (
        <>
            <Stack gap={1} sx={{ height: '100%' }}>
                <Typography level="h1">
                    Unknowns
                    {` `}
                    <Typography level="h4">
                        {unknownsQuery.isFetching ? (
                            <span style={{ fontSize: 'small' }}>Fetching...</span>
                        ) : null}
                    </Typography>
                </Typography>
                <Divider />
                <List>
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
                                const item = data[vItem.index]
                                return (
                                    <div
                                        key={vItem.key}
                                        data-index={vItem.index}
                                        ref={virtualizer.measureElement}
                                    >
                                        {/* conditional to see if element is a coll title or a disc */}
                                        {!item._id ?
                                            <>
                                                <Sheet sx={{ height: "5px" }} />
                                                <Divider />
                                                <Sheet sx={{ height: "5px" }} />
                                                <Typography level="body-md" noWrap
                                                >
                                                    <i>{item}</i>
                                                </Typography>
                                                <Sheet sx={{ height: "5px" }} />
                                                <Divider />
                                                <Sheet sx={{ height: "5px" }} />
                                            </>
                                            :
                                            <>
                                                <DiscListItem
                                                    key={item._id}
                                                    discId={item._id}
                                                    collectionId={item.collId}
                                                    deleteFn={async () => await deleteDiscMutation.mutate(item._id)}
                                                    drawerFn={() => drawerFunction(item._id, item.collId)}
                                                />
                                            </>}

                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                </List>
            </Stack >
            <Drawer
                open={open}
                onClose={() => setOpen(false)}
                anchor="bottom"
                size="xs"
            >
                <List
                    size="lg"
                    component="nav"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                    }}
                >
                    <ListItem>{modalDisc.title}</ListItem>
                    <Divider />
                    <ListItemButton
                        onClick={() => setIsEditModalOpen(true)}
                        color="warning"
                        sx={{ fontWeight: "lg" }}>
                        <ListItemDecorator>
                            <Edit />
                        </ListItemDecorator>
                        Edit Title
                    </ListItemButton>
                    <Divider />
                    <ListItemButton
                        onClick={() => setIsDeleteModalOpen(true)}
                        color="danger"
                        sx={{ fontWeight: "lg" }}>
                        <ListItemDecorator>
                            <DeleteIcon />
                        </ListItemDecorator>
                        Delete
                    </ListItemButton>
                </List>
            </Drawer>
            {/* edit modal */}
            <Modal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <ModalDialog
                    variant="outlined"
                    sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
                >
                    <Typography
                        component="h2"
                        level="h4"
                        textColor="inherit"
                        sx={{ fontWeight: 'lg', mb: 1 }}
                    >
                        Rename Item
                    </Typography>
                    <SingleLineForm
                        submitButtonText="Update!"
                        labelText="New Title"
                        onSubmit={(title: string) => updateRefDiscMutation.mutate({ discId: modalDisc.id, title })}
                    />
                </ModalDialog>
            </Modal>
            {/* delete modal */}
            <Modal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <ModalDialog
                    variant="outlined"
                    sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
                >
                    <Typography
                        component="h2"
                        level="h4"
                        textColor="inherit"
                        sx={{ fontWeight: 'lg', mb: 1 }}
                    >
                        Confirm Deletion
                    </Typography>
                    <Typography
                        component="h2"
                        level="body-sm"
                        textColor="inherit"
                        sx={{ fontWeight: 'sm', mb: 1 }}
                    >
                        {modalDisc.title}
                    </Typography>
                    <Typography
                        level="body-sm"
                        startDecorator={<InfoOutlined />}
                        sx={{ alignItems: 'flex-start', maxWidth: 240, wordBreak: 'break-all' }}
                    >
                        This action cannot be undone.
                    </Typography>
                    <Button onClick={() => deleteDisc()} color="danger">
                        Delete
                    </Button>
                </ModalDialog>
            </Modal>
        </>
    )
}
