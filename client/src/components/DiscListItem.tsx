import
{
    List,
    ListItem,
    ListItemDecorator,
    ListItemContent,
    ListItemButton,
    Drawer,
    Typography,
    AspectRatio,
    IconButton,
    Divider,
    Modal,
    ModalDialog,
    Button,
    Stack,
} from "@mui/joy";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';

import { useState } from "react";
import { Edit, InfoOutlined, Refresh } from "@mui/icons-material";
import { SingleLineForm } from "./SingleLineForm";
import { useNavigate } from "@tanstack/react-router";
import { IDisc, IReferenceDisc } from "../Interfaces";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DiscQueryOptions, ReferenceQueryOptions } from "../utilities/Queries";

export function DiscListItem(
    {
        discId,
        collectionId,
        // title = "notitle",
        // barcode = "0000000000000",
    }: {
        discId: string,
        collectionId: string,
        // title: string,
        // barcode: string,
        // trueData: boolean,
        // imageLink: string,
        // deleteFn: (...args: any[]) => void,
        // updateRefFn: (...args: any[]) => void,
    })
{
    const navigate = useNavigate();

    const queryClient = useQueryClient()

    const [open, setOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const token: string | undefined = queryClient.getQueryData(["accesstoken"])

    const discQuery = useQuery(DiscQueryOptions(token, collectionId, discId))
    const referenceQuery = useQuery(ReferenceQueryOptions(token, discQuery.data?.referenceDVD))

    if (discQuery.isLoading || referenceQuery.isLoading)
    {
        return (<pre>Disc Loading...</pre>)
    }

    if (discQuery.isError || referenceQuery.isError)
    {
        return (<pre>Disc Error.</pre>)
    }

    // return (
    //     <Stack direction="row" gap={1} sx=
    //         {{
    //             justifyContent: "space-between",
    //             alignItems: "center",
    //         }}>
    //         {JSON.stringify(discQuery.data)}
    //         {"---"}
    //         {JSON.stringify(referenceQuery.data)}
    //     </Stack>
    // )

    return (
        <>
            <ListItem>
                <ListItemButton sx={{ px: 0 }}>
                    <ListItemButton
                        onClick={() => navigate({ to: `/collections/${collectionId}/${discId}` })}
                    >
                        <ListItemDecorator sx={{ mx: "auto" }}>
                            <AspectRatio ratio="135 / 190" flex>
                                <img src={referenceQuery.data.images[0]} />
                            </AspectRatio>
                        </ListItemDecorator>
                        <ListItemContent>
                            <Typography level="title-sm" noWrap>
                                {referenceQuery.data.title}
                            </Typography>
                            <Typography level="body-sm" noWrap>
                                Barcode: {referenceQuery.data.barcode}
                            </Typography>
                        </ListItemContent>
                    </ListItemButton>
                    {referenceQuery.data.upcitemdb_truedata ? <></> :
                        // <IconButton onClick={() => updateRefFn("test title")}
                        <IconButton onClick={() => alert("test title")}
                            sx={{ backgroundColor: "blue" }}>
                            <Refresh sx={{ color: `#42e308` }} />
                        </IconButton>}
                    <IconButton onClick={() => setOpen(true)}>
                        <MoreVertIcon />
                    </IconButton>
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
                            <ListItem>{referenceQuery.data.title}</ListItem>
                            <Divider />
                            <ListItemButton
                                // onClick={() => updateRefFn()}
                                onClick={() => setIsModalOpen(true)}
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
                </ListItemButton>
            </ListItem>
            {/* edit modal */}
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
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
                        // onSubmit={(title: string) => updateRefFn(title)}
                        onSubmit={(title: string) => alert("title")}
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
                        {referenceQuery.data.title}
                    </Typography>
                    <Typography
                        level="body-sm"
                        startDecorator={<InfoOutlined />}
                        sx={{ alignItems: 'flex-start', maxWidth: 240, wordBreak: 'break-all' }}
                    >
                        This action cannot be undone.
                    </Typography>
                    {/* <Button onClick={deleteFn} color="danger"> */}
                    <Button onClick={() => alert("delete")} color="danger">
                        Delete
                    </Button>
                </ModalDialog>
            </Modal>
        </>
    )
}