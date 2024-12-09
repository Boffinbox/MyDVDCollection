import { Sheet } from "@mui/joy";

export function ScannerCameraMark()
{
    const color = `#7f7f7f`

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
                    <Sheet sx={{
                        position: "absolute",
                        height: "40%",
                        width: "50%",
                        backgroundColor: `${color}`,
                        top: "50%",
                        left: "50%",
                        clipPath: "rect(0% 100% 100% 0%)",
                        transform: "translate(-60%, -50%)",
                    }}></Sheet>
                    <Sheet sx={{
                        position: "absolute",
                        height: "30%",
                        width: "30%",
                        backgroundColor: `transparent`,
                        top: "50%",
                        left: "50%",
                        clipPath: "rect(0% 50% 100% 0%)",
                        transform: "translate(60%, -50%)",
                    }}>
                        <Sheet sx={{
                            position: "absolute",
                            height: "70%",
                            width: "70%",
                            top: "50%",
                            left: "50%",
                            backgroundColor: `${color}`,
                            clipPath: "rect(0% 100% 100% 0%)",
                            transform: "translate(-50%, -50%) rotate(45deg)",
                        }}></Sheet>
                    </Sheet>
                </Sheet>
            </Sheet >
        </>
    )
}