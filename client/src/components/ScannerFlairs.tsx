import { Sheet } from "@mui/joy";

export function ScannerFlairs()
{
    return (
        <>
            <Sheet
                sx={{
                    position: "absolute",
                    width: "80%",
                    height: "50%",
                    borderRadius: "15dvw",
                    border: "0.5dvh solid grey",
                    borderLeft: "1dvw",
                    borderRight: "1dvw",
                    backgroundColor: "transparent"
                }}
            >
            </Sheet>
            <Sheet
                sx={{
                    position: "absolute",
                    width: "80%",
                    height: "49.4%",
                    borderRadius: "15dvw",
                    border: "0.5dvh solid dimgrey",
                    borderLeft: "1dvw",
                    borderRight: "1dvw",
                    backgroundColor: "transparent"
                }}
            >
            </Sheet>
        </>
    )
}