import { useNavigate } from "@tanstack/react-router"

import { Drawer, List, ListItem, Divider, ListItemButton, ListItemDecorator, Typography, useColorScheme } from "@mui/joy"

import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export function NonAuthSettingsDrawer({ open, setOpen }: { open: boolean, setOpen: (arg0: boolean) => void })
{
    const { mode, setMode } = useColorScheme();

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
                <ListItemButton
                    sx={{ fontWeight: "lg" }}
                    onClick={() =>
                    {
                        setMode(mode === "light" ? "dark" : "light")
                    }}
                >
                    {mode === "light" ?
                        <>
                            <ListItemDecorator>
                                <DarkModeIcon />
                            </ListItemDecorator>
                            <Typography>Dark mode</Typography>
                        </> : <>
                            <ListItemDecorator>
                                <LightModeIcon />
                            </ListItemDecorator>
                            <Typography>Light mode</Typography>
                        </>}
                </ListItemButton>
            </List>
        </Drawer>
    )
}