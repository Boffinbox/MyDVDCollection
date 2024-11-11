import { Sheet } from "@mui/joy";
import { keyframes } from "@mui/system"

export function Checkmark()
{
    const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100%
    {
        transform: rotate(360deg);
    }`;

    return (
        <>
            <Sheet sx={{
                display: "inline-block",
                height: "20dvh",
                width: "20dvh",

            }}>
                <Sheet sx={{
                    height: "100%",
                    width: "100%",
                    border: "1.8dvh solid rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    borderLeftColor: "green",
                    animation: `${spin} 1.2s ease-in-out infinite`,
                }}>
                </Sheet>
                <Sheet sx={{
                    height: "10dvh",
                    width: "5dvh",
                    borderTop: "1.8dvh solid green",
                    borderRight: "1.8dvh solid green",
                    left: "3dvh",
                    top: "9dvh",
                    transform: "scaleX(-1) rotate(135deg)",
                    transformOrigin: "left top"
                }}>
                    <Sheet sx={{

                    }}>
                    </Sheet>
                </Sheet>
            </Sheet>
        </>
    )
}