import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useState } from "react";
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

export const Route = createFileRoute('/_mdc/unknowns')({
    component: UnknownCollection,
})

function UnknownCollection()
{
    const queryClient = useQueryClient()

    const tokenQuery = useQuery(AccessTokenQueryOptions())
    const token: string | undefined = tokenQuery.data

    const unknownsQuery = useQuery(UnknownsQueryOptions(token))

    const [open, setOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [modalDisc, setModalDisc] = useState<{ id: string, title: string, collId: string }>({ id: "undefined", title: "undefined", collId: "undefined" })

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
                    {unknownsQuery.data.map((coll, idx: number) =>
                    (
                        <>
                            <Typography level="body-md" noWrap
                            >
                                <i>{coll.title}</i>
                            </Typography>
                            <Sheet sx={{ height: "5px" }} />
                            <Divider />
                            <Sheet sx={{ height: "5px" }} />
                            {coll.discs.map((disc, idx: number) =>
                            (
                                <>
                                    <DiscListItem
                                        key={disc._id}
                                        discId={disc._id}
                                        collectionId={coll._id}
                                        deleteFn={async () => await deleteDiscMutation.mutate(disc._id)}
                                        drawerFn={() => drawerFunction(disc._id, coll._id)}
                                    />
                                </>
                            ))}
                            <Sheet sx={{ height: "5px" }} />
                            <Divider />
                            <Sheet sx={{ height: "5px" }} />
                        </>
                    ))}
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
