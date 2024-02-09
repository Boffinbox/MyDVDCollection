import { useNavigate } from "@tanstack/react-router"

import
{
    ButtonGroup,
    Button,
    Divider,
    Sheet,
    Typography,
} from "@mui/joy"

import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from "react";
import { NonAuthSettingsDrawer } from "./NonAuthSettingsDrawer";

export function NonAuthAppbar()
{
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
                    sx={{ borderRadius: 0, height: "8dvh" }}
                >
                    <Button
                        sx={{
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
                <NonAuthSettingsDrawer open={open} setOpen={setOpen} />
            </Sheet >
        </>
    )

}