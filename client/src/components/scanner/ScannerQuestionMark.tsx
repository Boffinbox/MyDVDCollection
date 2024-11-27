import { Sheet } from "@mui/joy";
import { keyframes } from "@mui/system"

export function ScannerQuestionMark()
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

    const duration = `400ms`
    const color = `#0000ff`

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
                    height: "36%",
                    width: "36%",
                    borderRadius: "50%",
                    backgroundColor: `${color}`,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -84%)",
                }}>
                    <Sheet sx={{
                        position: "absolute",
                        height: "50%",
                        width: "100%",
                        top: "50%",
                        left: "50%",
                        clipPath: "rect(0% 100% 100% 40%)",
                        transform: "translate(-90%, -0%)",
                    }}></Sheet>
                    <Sheet sx={{
                        position: "absolute",
                        height: "50%",
                        width: "50%",
                        borderRadius: "50%",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}></Sheet>
                    <Sheet sx={{
                        position: "absolute",
                        height: "25%",
                        width: "25%",
                        borderRadius: "50%",
                        backgroundColor: `${color}`,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-200%, -50%)",
                    }}></Sheet>
                    <Sheet sx={{
                        position: "absolute",
                        height: "60%",
                        width: "52%",
                        borderTopLeftRadius: "50%",
                        backgroundColor: `${color}`,
                        top: "50%",
                        left: "50%",
                        clipPath: "rect(0% 50% 50% 0%)",
                        transform: "translate(-24%, 37.5%)",
                    }}></Sheet>
                    <Sheet sx={{
                        position: "absolute",
                        height: "15%",
                        width: "25%",
                        backgroundColor: `${color}`,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, 345%)",
                    }}></Sheet>
                    <Sheet sx={{
                        position: "absolute",
                        height: "25%",
                        width: "25%",
                        backgroundColor: `${color}`,
                        top: "50%",
                        left: "50%",
                        transform: "translate(0%, 150%)",
                    }}></Sheet>
                    <Sheet sx={{
                        position: "absolute",
                        height: "25%",
                        width: "25%",
                        borderRadius: "50%",
                        backgroundColor: `${color}`,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, 220%)",
                    }}></Sheet>
                    <Sheet sx={{
                        position: "absolute",
                        height: "60%",
                        width: "50%",
                        borderTopLeftRadius: "33%",
                        top: "50%",
                        left: "50%",
                        clipPath: "rect(0% 50% 50% 0%)",
                        transform: "translate(25%, 71%)",
                    }}></Sheet>
                    <Sheet sx={{
                        position: "absolute",
                        height: "25%",
                        width: "25%",
                        borderRadius: "50%",
                        backgroundColor: `${color}`,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, 380%)",
                    }}></Sheet>
                </Sheet>
            </Sheet >
        </>
    )
}