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

} from "@mui/joy";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';

import { useState } from "react";
import { Edit } from "@mui/icons-material";
import { SingleLineForm } from "./SingleLineForm";

export function DiscListItem(
    {
        title = "notitle",
        barcode = "0000000000000",
        discId,
        deleteFn,
        updateRefFn
    }: {
        title: string,
        barcode: string,
        discId: string,
        deleteFn: (...args: any[]) => void,
        updateRefFn: (...args: any[]) => void,
    })
{
    const [open, setOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);


    return (
        <>
            <ListItem>
                <ListItemButton sx={{ px: 0 }}>
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
                    <IconButton onClick={() => setOpen(true)}>
                        <MoreVertIcon />
                    </IconButton>
                    <Drawer
                        open={open}
                        onClose={() => setOpen(false)}
                        anchor="bottom"
                        size="sm"
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
                            <ListItemButton>And</ListItemButton>
                            <ListItemButton>Here's</ListItemButton>
                            <ListItemButton>Some</ListItemButton>
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
                            <ListItemButton>Other</ListItemButton>
                            <ListItemButton>Actions</ListItemButton>
                            <Divider />
                            <ListItemButton onClick={deleteFn} color="danger" sx={{ fontWeight: "lg" }}>
                                <ListItemDecorator>
                                    <DeleteIcon />
                                </ListItemDecorator>
                                Delete
                            </ListItemButton>
                        </List>
                    </Drawer>
                </ListItemButton>
            </ListItem>
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
        </>
    )
}