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
                    size="sm"
                >
                    <RouterLink to="/home" activeOptions={{ exact: true }}>
                        {({ isActive }) =>
                        {
                            return (
                                <Button
                                    sx={{ height: "10vh", width: "25vw" }}
                                    disabled={!isActive}
                                    endDecorator={"Home"}
                                >
                                    <HomeIcon />
                                </Button>
                            )
                        }}

                    </RouterLink>{` `}
                    <RouterLink to="/collections">
                        {({ isActive }) =>
                        {
                            return (
                                <Button
                                    sx={{ height: "10vh", width: "25vw" }}
                                    disabled={!isActive}
                                    endDecorator={"Collections"}
                                >
                                    <VideoLibraryIcon />
                                </Button>
                            )
                        }}
                    </RouterLink>
                    <RouterLink to="/login">
                        {({ isActive }) =>
                        {
                            return (
                                <Button
                                    sx={{ height: "10vh", width: "25vw" }}
                                    disabled={!isActive}
                                    endDecorator={"Login"}
                                >
                                    <LoginIcon />
                                </Button>
                            )
                        }}
                    </RouterLink>{` `}
                    <Sheet>
                        <Button
                            sx={{ height: "10vh", width: "25vw" }}
                            onClick={() =>
                            {
                                setMode(mode === "light" ? "dark" : "light")
                            }}
                            endDecorator={mode === "light" ? "Turn dark" : "Turn light"}
                        >
                            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                        </Button>
                    </Sheet>
                </ButtonGroup>
            </Sheet>
        </>
    )

}