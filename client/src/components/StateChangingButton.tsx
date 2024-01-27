export function StateChangingButton(
    {
        text,
        toServer,
        toClient
    }: {
        text: string,
        toServer: (...args: any[]) => void,
        toClient: (...args: any[]) => void
    })
{
    return (
        <>
            <form action="" onSubmit={async (evt) =>
            {
                evt.preventDefault();
                try
                {
                    await toServer();
                    toClient();
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