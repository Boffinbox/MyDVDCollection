import { Sheet } from "@mui/joy";
import { keyframes } from "@mui/system"

export function ScannerCheckMark()
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

    const check1 = keyframes`
    0% {
        clip-path: rect(0% 100% 100% 0%);
    }
    1% {
        clip-path: rect(0% 100% 100% 100%);
    }
    50%
    {
        clip-path: rect(0% 100% 100% 0%);
    }`;

    const check2 = keyframes`
    0% {
        clip-path: rect(0% 100% 100% 0%);
    }
    1% {
        clip-path: rect(0% 100% 100% 100%);
    }
    50% {
        clip-path: rect(0% 100% 100% 100%);
    }
    100%
    {
        clip-path: rect(0% 100% 100% 0%);
    }`;

    const duration = `4000ms`
    const color = `#00aa00`

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
                    clipPath: "rect(0% 100% 100% 50%)",
                }}>
                    <Sheet sx={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        backgroundColor: `${color}`,
                        borderRadius: "50%",
                        clipPath: "rect(0% 50% 100% 0%)",
                        animation: `${spin} ${duration} ease-in-out 1 forwards`,
                    }}></Sheet>
                </Sheet>
                <Sheet sx={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                    clipPath: "rect(0% 100% 100% 50%)",
                    animation: `${spin} ${duration} ease-in-out 1 forwards`,
                }}>
                    <Sheet sx={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        backgroundColor: `${color}`,
                        borderRadius: "50%",
                        clipPath: "rect(0% 50% 100% 0%)",
                        animation: `${spin} ${duration} ease-in-out 1 forwards`,
                    }}></Sheet>
                </Sheet>
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
                    animation: `${check1} ${duration} ease-in-out 1 forwards`,
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
                    animation: `${check2} ${duration} ease-in-out 1 forwards`,
                }}></Sheet>
            </Sheet >
        </>
    )
}