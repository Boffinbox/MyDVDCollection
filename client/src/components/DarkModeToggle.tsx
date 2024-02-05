import { Button } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";

export function DarkModeToggle()
{
    const { mode, setMode } = useColorScheme();

    return <Button
        variant="outlined"
        onClick={() =>
        {
            setMode(mode === "light" ? "dark" : "light")
        }}
    >
        {mode === "light" ? "Turn dark" : "Turn light"}
    </Button>
}