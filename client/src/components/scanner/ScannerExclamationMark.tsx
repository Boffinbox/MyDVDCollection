import { Sheet } from "@mui/joy";

export function ScannerExclamationMark()
{
    const color = `#de28a5`

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
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
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
                    height: "40%",
                    width: "10%",
                    backgroundColor: `${color}`,
                    borderRadius: "10%",
                    top: "50%",
                    left: "50%",
                    clipPath: "rect(0% 100% 100% 0%)",
                    transform: "translate(-50%, -75%)",
                }}></Sheet>
                <Sheet sx={{
                    position: "absolute",
                    height: "10%",
                    width: "10%",
                    backgroundColor: `${color}`,
                    borderRadius: "10%",
                    top: "50%",
                    left: "50%",
                    clipPath: "rect(0% 100% 100% 0%)",
                    transform: "translate(-50%, -300%)",
                }}></Sheet>
                <Sheet sx={{
                    position: "absolute",
                    height: "10%",
                    width: "10%",
                    backgroundColor: `${color}`,
                    borderRadius: "10%",
                    top: "50%",
                    left: "50%",
                    clipPath: "rect(0% 100% 100% 0%)",
                    transform: "translate(-50%, 0%)",
                }}></Sheet>

                <Sheet sx={{
                    position: "absolute",
                    height: "10%",
                    width: "10%",
                    backgroundColor: `${color}`,
                    borderRadius: "10%",
                    top: "50%",
                    left: "50%",
                    clipPath: "rect(0% 100% 100% 0%)",
                    transform: "translate(-50%, 180%)",
                }}></Sheet>
            </Sheet >
        </>
    )
}