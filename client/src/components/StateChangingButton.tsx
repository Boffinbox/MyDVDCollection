import { Button } from "@mui/joy"
import DevLog from "../utilities/DevLog";

export function StateChangingButton(
    {
        text,
        onSubmit,
    }: {
        text: string,
        onSubmit: (...args: any[]) => void,
    })
{
    return (
        <>
            <form action="" onSubmit={async (evt) =>
            {
                evt.preventDefault();
                try
                {
                    DevLog(onSubmit)
                    await onSubmit()
                }
                catch (e)
                {
                    DevLog("Couldn't perform action.")
                }
            }}>
                <Button type="submit" sx={{}}>
                    {text}
                </Button>
            </form>
        </>
    )
}