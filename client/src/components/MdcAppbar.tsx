import { useNavigate } from "@tanstack/react-router"

import
{
    ButtonGroup,
    Button,
    Divider,
    Sheet,
    Typography,
} from "@mui/joy"

import AddCircleIcon from '@mui/icons-material/AddCircle';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from "react";
import { MdcSettingsDrawer } from './MdcSettingsDrawer';

export function MdcAppbar()
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
                        onClick={() => navigate({ to: "/collections" })}
                    >
                        <VideoLibraryIcon />
                        <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                            Collections
                        </Typography>
                    </Button>
                    <Button
                        sx={{
                            display: "flex",
                            justifyContent: "space-evenly"
                        }}
                        onClick={() => navigate({ to: "/newform" })}
                    >
                        <AddCircleIcon />
                        <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                            Add DVD
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
                <MdcSettingsDrawer open={open} setOpen={setOpen} />
            </Sheet >
        </>
    )

}