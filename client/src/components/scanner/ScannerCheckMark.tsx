import { Sheet } from "@mui/joy";

export function ScannerCheckMark()
{
    const color = `#42e308`

    return (
        <>
            <Sheet sx={{
                position: "relative",
                height: "100%",
                aspectRatio: "1"
            }}>
                <Sheet sx={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                    backgroundColor: `${color}`,
                }}></Sheet>
                <Sheet sx={{
                    position: "absolute",
                    height: "80%",
                    width: "80%",
                    borderRadius: "50%",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                </Sheet>
                <Sheet sx={{
                    position: "absolute",
                    height: "10%",
                    width: "25%",
                    backgroundColor: `${color}`,
                    top: "50%",
                    left: "50%",
                    clipPath: "rect(0% 100% 100% 0%)",
                    transform: "translate(-108%, 39%) rotate(225deg)",
                }}></Sheet>
                <Sheet sx={{
                    position: "absolute",
                    height: "10%",
                    width: "50%",
                    backgroundColor: `${color}`,
                    top: "50%",
                    left: "50%",
                    clipPath: "rect(0% 100% 100% 0%)",
                    transform: "translate(-40%, -50%) rotate(135deg)",
                }}></Sheet>
            </Sheet >
        </>
    )
}