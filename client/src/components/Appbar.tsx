import { useNavigate } from "@tanstack/react-router"

import
{
    ButtonGroup,
    Button,
    useColorScheme,
    Divider,
    Sheet,
    Typography,
    IconButton,
    Drawer,
    ListItem,
    ListItemButton,
    ListItemDecorator,
    List
} from "@mui/joy"

import HomeIcon from '@mui/icons-material/Home';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import LoginIcon from '@mui/icons-material/Login';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from "react";

export function Appbar()
{
    const { mode, setMode } = useColorScheme();

    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    return (
        <>
            <Sheet
                sx={{
                    width: "100%"
                }}>
                <Divider />
                <ButtonGroup
                    buttonFlex={1}
                    variant="plain"
                    size="lg"
                    sx={{ borderRadius: 0 }}
                >
                    <Button
                        sx={{
                            height: "8dvh",
                            width: "25dvw",
                            display: "flex",
                            justifyContent: "space-evenly"
                        }}
                        onClick={() => navigate({ to: "/home" })}
                    >
                        <HomeIcon />
                        <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                            Home
                        </Typography>
                    </Button>
                    <Button
                        sx={{
                            height: "8dvh",
                            width: "25dvw",
                            display: "flex",
                            justifyContent: "space-evenly"
                        }}
                        onClick={() => navigate({ to: "/collections" })}
                    >
                        <VideoLibraryIcon />
                        <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                            Collections
                        </Typography>
                    </Button>
                    <Button
                        sx={{
                            height: "8dvh",
                            width: "25dvw",
                            display: "flex",
                            justifyContent: "space-evenly"
                        }}
                        onClick={() => navigate({ to: "/login" })}
                    >
                        <LoginIcon />
                        <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                            Login
                        </Typography>
                    </Button>
                    <Button
                        sx={{
                            height: "8dvh",
                            width: "25dvw",
                            display: "flex",
                            justifyContent: "space-evenly",
                        }}
                        onClick={() => { setOpen(true) }}
                    >
                        <SettingsIcon />
                        <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                            Settings
                        </Typography>
                    </Button>
                </ButtonGroup>
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
                                    <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                                        Turn dark
                                    </Typography>
                                </> : <>
                                    <ListItemDecorator>
                                        <LightModeIcon />
                                    </ListItemDecorator>
                                    <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                                        Turn light
                                    </Typography>
                                </>}
                        </ListItemButton>
                    </List>
                </Drawer>
            </Sheet >
        </>
    )

}