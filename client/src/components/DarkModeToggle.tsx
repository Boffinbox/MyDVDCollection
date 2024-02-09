import { ListItemButton, ListItemDecorator, Typography, useColorScheme } from "@mui/joy";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export function DarkModeToggle()
{
    const { mode, setMode } = useColorScheme();

    return (
        <ListItemButton
            sx={{ fontWeight: "lg" }
            }
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
        </ListItemButton >
    )
}