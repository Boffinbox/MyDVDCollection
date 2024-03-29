import { Button } from "@mui/joy"

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
                    console.log(onSubmit)
                    await onSubmit()
                }
                catch (e)
                {
                    console.log("Couldn't perform action.")
                }
            }}>
                <Button type="submit" sx={{}}>
                    {text}
                </Button>
            </form>
        </>
    )
}