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

} from "@mui/joy";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';

import { useState } from "react";
import { Edit, InfoOutlined } from "@mui/icons-material";
import { SingleLineForm } from "./SingleLineForm";
import { useNavigate } from "@tanstack/react-router";

export function DiscListItem(
    {
        title = "notitle",
        barcode = "0000000000000",
        collectionId,
        discId,
        deleteFn,
        updateRefFn
    }: {
        title: string,
        barcode: string,
        collectionId: string,
        discId: string,
        deleteFn: (...args: any[]) => void,
        updateRefFn: (...args: any[]) => void,
    })
{
    const [open, setOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const navigate = useNavigate();


    return (
        <>
            <ListItem>
                <ListItemButton sx={{ px: 0 }}>
                    <ListItemButton
                        onClick={() => navigate({ to: `/collections/${collectionId}/${discId}` })}
                    >
                        <ListItemDecorator sx={{ mx: "auto" }}>
                            <AspectRatio ratio="135 / 190" flex>
                                <img src="/dev/dvd.jpg" />
                            </AspectRatio>
                        </ListItemDecorator>
                        <ListItemContent>
                            <Typography level="title-sm" noWrap>
                                {title}
                            </Typography>
                            <Typography level="body-sm" noWrap>
                                Barcode: {barcode}
                            </Typography>
                        </ListItemContent>
                    </ListItemButton>
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
                            <ListItem>{title}</ListItem>
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
                        onSubmit={(title: string) => updateRefFn(title)}
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
                        {title}
                    </Typography>
                    <Typography
                        level="body-sm"
                        startDecorator={<InfoOutlined />}
                        sx={{ alignItems: 'flex-start', maxWidth: 240, wordBreak: 'break-all' }}
                    >
                        This action cannot be undone.
                    </Typography>
                    <Button onClick={deleteFn} color="danger">
                        Delete
                    </Button>
                </ModalDialog>
            </Modal>
        </>
    )
}