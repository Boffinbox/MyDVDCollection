import { Link as RouterLink } from "@tanstack/react-router"

import { ButtonGroup, Button } from "@mui/joy"
import HomeIcon from '@mui/icons-material/Home';

import { DarkModeToggle } from "./DarkModeToggle"

export function Appbar()
{
    return (
        <>
            <ButtonGroup
                variant="plain"
                buttonFlex={1}
                size="lg"
            >
                <RouterLink to="/home" activeOptions={{ exact: true }}>
                    {({ isActive }) =>
                    {
                        return (
                            <Button sx={{ height: "10vh" }} disabled={!isActive}>
                                <HomeIcon />
                                Home
                            </Button>
                        )
                    }}

                </RouterLink>{` `}
                <RouterLink to="/collections">
                    <Button sx={{ height: "10vh" }}>Collections</Button>
                </RouterLink>
                <RouterLink to="/login">
                    <Button>Login</Button>
                </RouterLink>{` `}
                <DarkModeToggle />
            </ButtonGroup>
        </>
    )

}