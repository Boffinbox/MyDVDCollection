import { createFileRoute } from '@tanstack/react-router'
import { DeleteDisc } from '../../httpverbs/DeleteDisc'
import { PostBarcode } from '../../httpverbs/PostBarcode'
import { PostReference } from '../../httpverbs/PostReference'
import { SingleLineForm } from '../../components/SingleLineForm'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import
{
    AccessTokenQueryOptions,
    CollectionQueryOptions
} from '../../utilities/Queries'
import { ICollection, IDisc, IReferenceDisc } from '../../Interfaces'
import { DiscListItem } from '../../components/DiscListItem'
import { Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemDecorator, Modal, ModalDialog, Sheet, Stack, Typography } from '@mui/joy'
import { useState } from 'react'
import { Edit, InfoOutlined } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete';

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

    const [open, setOpen] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const [modalDisc, setModalDisc] = useState<{ id: string, title: string }>({ id: "undefined", title: "undefined" })

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
            setModalDisc({ id: modalDisc.id, title: returnedRef.title })
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

    function drawerFunction(discId: string)
    {
        setOpen(true)
        const discData: IDisc = queryClient.getQueryData(["disc", discId])!
        const refData: IReferenceDisc = queryClient.getQueryData(["reference", discData.referenceDVD])!
        setModalDisc({ id: discData._id, title: refData.title })
    }

    function deleteDisc()
    {
        setOpen(false)
        setIsEditModalOpen(false)
        setIsDeleteModalOpen(false)
        deleteDiscMutation.mutate(modalDisc.id)
        setModalDisc({ id: "undefined", title: "undefined" })
    }

    if (collection == undefined)
    {
        return (
            <>
                <div>Oh no! Something went wrong...</div>
                <pre>{"404: No collection found at this URL."}</pre>
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
                            drawerFn={() => drawerFunction(disc)}
                        />
                    ))}
                </List>
            </Stack>
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
