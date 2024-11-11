import { Sheet } from "@mui/joy";
import { keyframes } from "@mui/system"

export function Checkmark()
{
    const spin = keyframes`
    0% {
        transform: rotate(180deg);
    }
    1% {
        transform: rotate(0deg);
    }
    100%
    {
        transform: rotate(180deg);
    }`;

    return (
        <>
            <Sheet sx={{
                position: "relative",
                height: "20dvh",
                width: "20dvh"
            }}>
                <Sheet sx={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                    clipPath: "rect(0dvh 20dvh 20dvh 10dvh)",
                }}>
                    <Sheet sx={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        backgroundColor: "#008800",
                        borderRadius: "50%",
                        clipPath: "rect(0dvh 10dvh 20dvh 0dvh)",
                        animation: `${spin} 400ms ease-in-out 1 forwards`,
                    }}></Sheet>
                </Sheet>
                <Sheet sx={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                    clipPath: "rect(0dvh 20dvh 20dvh 10dvh)",
                    animation: `${spin} 400ms ease-in-out 1 forwards`,
                }}>
                    <Sheet sx={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        backgroundColor: "#008800",
                        borderRadius: "50%",
                        clipPath: "rect(0dvh 10dvh 20dvh 0dvh)",
                        animation: `${spin} 400ms ease-in-out 1 forwards`,
                    }}></Sheet>
                </Sheet>
                {/* <Sheet sx={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                    backgroundColor: "pink",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}></Sheet> */}
                <Sheet sx={{
                    position: "absolute",
                    height: "80%",
                    width: "80%",
                    borderRadius: "50%",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}></Sheet>
                <Sheet sx={{
                    display: "absolute",
                    height: "5dvh",
                    width: "10dvh",
                    borderTop: "1.8dvh solid green",
                    borderRight: "1.8dvh solid green",
                    top: "45%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(135deg)"
                }}></Sheet>
            </Sheet >
        </>
    )
}