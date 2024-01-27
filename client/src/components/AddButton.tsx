export function AddButton({ addToServer, addToClient }: { addToServer: () => void, addToClient: () => void })
{
    return (
        <>
            <form action="" onSubmit={async (evt) =>
            {
                evt.preventDefault();
                try
                {
                    await addToServer();
                    addToClient();
                }
                catch (e)
                {
                    console.log("Couldn't add.")
                }
            }}>
                <button style={{ backgroundColor: "lightblue" }}>
                    Submit!
                </button>
            </form>
        </>
    )
}