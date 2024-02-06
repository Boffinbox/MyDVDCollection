import { useNavigate } from "@tanstack/react-router"

import { ButtonGroup, Button, useColorScheme, Divider, Sheet, Typography } from "@mui/joy"

import HomeIcon from '@mui/icons-material/Home';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import LoginIcon from '@mui/icons-material/Login';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export function Appbar()
{
    const { mode, setMode } = useColorScheme();

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
                >
                    <Button
                        sx={{
                            height: "10dvh",
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
                            height: "10dvh",
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
                            height: "10dvh",
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
                            height: "10dvh",
                            width: "25dvw",
                            display: "flex",
                            justifyContent: "space-evenly"
                        }}
                        onClick={() =>
                        {
                            setMode(mode === "light" ? "dark" : "light")
                        }}
                    >
                        {mode === "light" ?
                            <>
                                <DarkModeIcon />
                                <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                                    Turn dark
                                </Typography>
                            </> : <>
                                <LightModeIcon />
                                <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                                    Turn light
                                </Typography>
                            </>}
                    </Button>
                </ButtonGroup>
            </Sheet>
        </>
    )

}