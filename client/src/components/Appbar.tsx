import { Link as RouterLink } from "@tanstack/react-router"

import { ButtonGroup, Button, useColorScheme, Divider, Sheet, Typography } from "@mui/joy"

import HomeIcon from '@mui/icons-material/Home';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import LoginIcon from '@mui/icons-material/Login';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export function Appbar()
{
    const { mode, setMode } = useColorScheme();

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
                    <RouterLink to="/home" activeOptions={{ exact: true }}>
                        {({ isActive }) =>
                        {
                            return (
                                <Button
                                    sx={{
                                        height: "10vh",
                                        width: "25vw",
                                        display: "flex",
                                        justifyContent: "space-evenly"
                                    }}
                                    disabled={!isActive}
                                >
                                    <HomeIcon />
                                    <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                                        Home
                                    </Typography>
                                </Button>
                            )
                        }}
                    </RouterLink>
                    <RouterLink to="/collections">
                        {({ isActive }) =>
                        {
                            return (
                                <Button
                                    sx={{
                                        height: "10vh",
                                        width: "25vw",
                                        display: "flex",
                                        justifyContent: "space-evenly"
                                    }}
                                    disabled={!isActive}
                                >
                                    <VideoLibraryIcon />
                                    <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                                        Collections
                                    </Typography>
                                </Button>
                            )
                        }}
                    </RouterLink>
                    <RouterLink to="/login">
                        {({ isActive }) =>
                        {
                            return (
                                <Button
                                    sx={{
                                        height: "10vh",
                                        width: "25vw",
                                        display: "flex",
                                        justifyContent: "space-evenly"
                                    }}
                                    disabled={!isActive}
                                >
                                    <LoginIcon />
                                    <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                                        Login
                                    </Typography>
                                </Button>
                            )
                        }}
                    </RouterLink>
                    <Sheet>
                        <Button
                            sx={{
                                height: "10vh",
                                width: "25vw",
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
                    </Sheet>
                </ButtonGroup>
            </Sheet>
        </>
    )

}