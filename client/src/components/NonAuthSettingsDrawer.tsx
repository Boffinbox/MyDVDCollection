import { useNavigate } from "@tanstack/react-router"

import { Drawer, List, ListItem, Divider, ListItemButton, ListItemDecorator, Typography } from "@mui/joy"

import LogoutIcon from '@mui/icons-material/Logout';
import { DarkModeToggle } from "./DarkModeToggle";

export function NonAuthSettingsDrawer({ open, setOpen }: { open: boolean, setOpen: (arg0: boolean) => void })
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
                <Divider />
                <ListItemButton
                    onClick={() => navigate({ to: "/attributions" })}
                >
                    <ListItemDecorator>
                        <LogoutIcon />
                    </ListItemDecorator>
                    <Typography>Attributions</Typography>
                </ListItemButton>
                <Divider />
            </List>
        </Drawer>
    )
}