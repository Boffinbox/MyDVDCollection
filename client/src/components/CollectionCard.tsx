import { Link as RouterLink } from "@tanstack/react-router"

import { AspectRatio, Button, Card, CardContent, CardOverflow, Divider, Drawer, IconButton, Link, List, ListItem, ListItemButton, ListItemDecorator, Modal, ModalDialog, Typography } from "@mui/joy"
import { useState } from "react";
import { SingleLineForm } from "./SingleLineForm";
import { Edit, InfoOutlined } from "@mui/icons-material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';

export function CollectionCard(
    {
        title = "My Default Collection",
        collId,
        deleteFn,
        updateCollTitleFn
    }: {
        title: string,
        collId: string,
        deleteFn: (...args: any[]) => void,
        updateCollTitleFn: (...args: any[]) => void,
    })
{
    const [open, setOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    return (
        <>
            <Card variant="soft" sx={{ mb: 2 }}>
                <CardOverflow>
                    <AspectRatio ratio="4" flex>
                        <img src="/dev/collection.jpg" />
                    </AspectRatio>
                </CardOverflow>
                <CardContent orientation="horizontal">
                    <Typography>
                        <Link
                            component={RouterLink}
                            overlay
                            to={`/collections/${collId}`}
                        >{title}
                        </Link>
                    </Typography>
                    <Typography level="body-sm">
                        Collection info $TODO
                    </Typography>
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
                </CardContent>
            </Card>
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
                        Rename Collecton
                    </Typography>
                    <SingleLineForm
                        submitButtonText="Update!"
                        labelText="New Title"
                        onSubmit={(title: string) => updateCollTitleFn(title)}
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
                        Confirm Collection Deletion
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
                        sx={{ alignItems: 'flex-start' }}
                    >
                        <Typography>
                            This will delete the collection, and <b>all</b> associated discs. This action cannot be undone!
                        </Typography>
                    </Typography>
                    <Button onClick={deleteFn} color="danger">
                        Delete
                    </Button>
                </ModalDialog>
            </Modal>
        </>
    )
}