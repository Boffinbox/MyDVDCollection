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

} from "@mui/joy";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';

import { useState } from "react";

export function DiscListItem(
    {
        title = "notitle",
        barcode = "0000000000000",
        discId,
        deleteFn
    }: {
        title: string,
        barcode: string,
        discId: string,
        deleteFn: (...args: any[]) => void,
    })
{
    const [open, setOpen] = useState(false);

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
        </>
    )
}