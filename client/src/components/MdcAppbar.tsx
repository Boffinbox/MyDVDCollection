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
import { MdcQuickAddDrawer } from "./MdcQuickAddDrawer";
import { Quiz } from "@mui/icons-material";

export function MdcAppbar()
{
    const [openSettings, setOpenSettings] = useState(false);
    const [openQuickAdd, setOpenQuickAdd] = useState(false);

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
                            justifyContent: "space-evenly",
                        }}
                        onClick={() => navigate({ to: "/scanner" })}
                    >
                        <Quiz />
                        <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                            Dupe Check
                        </Typography>
                    </Button>
                    <Button
                        sx={{
                            display: "flex",
                            justifyContent: "space-evenly"
                        }}
                        // onClick={() => navigate({ to: "/newform" })}
                        onClick={() => { setOpenQuickAdd(true) }}
                    >
                        <AddCircleIcon />
                        <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                            Quick Add
                        </Typography>
                    </Button>
                    <Button
                        sx={{
                            display: "flex",
                            justifyContent: "space-evenly",
                        }}
                        onClick={() => { setOpenSettings(true) }}
                    >
                        <SettingsIcon />
                        <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                            Settings
                        </Typography>
                    </Button>
                </ButtonGroup>
                <MdcQuickAddDrawer open={openQuickAdd} setOpen={setOpenQuickAdd} />
                <MdcSettingsDrawer open={openSettings} setOpen={setOpenSettings} />
            </Sheet >
        </>
    )

}