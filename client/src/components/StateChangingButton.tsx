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
                    await onSubmit()
                }
                catch (e)
                {
                    console.log("Couldn't add.")
                }
            }}>
                <button style={{ backgroundColor: "lightblue" }}>
                    {text}
                </button>
            </form>
        </>
    )
}