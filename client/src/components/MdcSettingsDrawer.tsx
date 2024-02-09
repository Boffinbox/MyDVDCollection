import { useNavigate } from "@tanstack/react-router"

import { Drawer, List, ListItem, Divider, ListItemButton, ListItemDecorator, Typography } from "@mui/joy"

import LogoutIcon from '@mui/icons-material/Logout';
import { DarkModeToggle } from "./DarkModeToggle";

export function MdcSettingsDrawer({ open, setOpen }: { open: boolean, setOpen: (arg0: boolean) => void })
{
    const navigate = useNavigate();

    return (
        <Drawer
            open={open}
            onClose={() => setOpen(false)}
            anchor="right"
            size="sm"
            sx={{
                borderRight: 0
            }}
        >
            <List
                size="lg"
                component="nav"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <ListItem>Settings</ListItem>
                <Divider />
                <DarkModeToggle />
                <ListItemButton>And</ListItemButton>
                <ListItemButton>Here's</ListItemButton>
                <ListItemButton>Some</ListItemButton>
                <ListItemButton>Other</ListItemButton>
                <ListItemButton>Actions</ListItemButton>
                <Divider />
                <ListItemButton
                    onClick={() => navigate({ to: "/logout" })}
                >
                    <ListItemDecorator>
                        <LogoutIcon />
                    </ListItemDecorator>
                    <Typography>Logout</Typography>
                </ListItemButton>
                <Divider />
            </List>
        </Drawer>
    )
}