import { Sheet } from "@mui/joy";

export function ScannerCrossMark()
{
    const color = `#ff8400`

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
                    top: "50%",
                    left: "50%",
                    clipPath: "rect(0% 100% 100% 0%)",
                    transform: "translate(-50%, -50%) rotate(45deg)",
                }}></Sheet>
                <Sheet sx={{
                    position: "absolute",
                    height: "40%",
                    width: "10%",
                    backgroundColor: `${color}`,
                    top: "50%",
                    left: "50%",
                    clipPath: "rect(0% 100% 100% 0%)",
                    transform: "translate(-50%, -50%) rotate(135deg)",
                }}></Sheet>
                <Sheet sx={{
                    position: "absolute",
                    height: "10%",
                    width: "10%",
                    backgroundColor: `${color}`,
                    borderTopLeftRadius: "40%",
                    borderTopRightRadius: "40%",
                    top: "50%",
                    left: "50%",
                    clipPath: "rect(0% 100% 100% 0%)",
                    transform: "translate(-200%, -200%) rotate(-45deg)",
                }}></Sheet>
                <Sheet sx={{
                    position: "absolute",
                    height: "10%",
                    width: "10%",
                    backgroundColor: `${color}`,
                    borderTopLeftRadius: "40%",
                    borderTopRightRadius: "40%",
                    top: "50%",
                    left: "50%",
                    clipPath: "rect(0% 100% 100% 0%)",
                    transform: "translate(100%, -200%) rotate(45deg)",
                }}></Sheet>
                <Sheet sx={{
                    position: "absolute",
                    height: "10%",
                    width: "10%",
                    backgroundColor: `${color}`,
                    borderTopLeftRadius: "40%",
                    borderTopRightRadius: "40%",
                    top: "50%",
                    left: "50%",
                    clipPath: "rect(0% 100% 100% 0%)",
                    transform: "translate(100%, 100%) rotate(135deg)",
                }}></Sheet>
                <Sheet sx={{
                    position: "absolute",
                    height: "10%",
                    width: "10%",
                    backgroundColor: `${color}`,
                    borderTopLeftRadius: "40%",
                    borderTopRightRadius: "40%",
                    top: "50%",
                    left: "50%",
                    clipPath: "rect(0% 100% 100% 0%)",
                    transform: "translate(-200%, 100%) rotate(-135deg)",
                }}></Sheet>
            </Sheet >
        </>
    )
}