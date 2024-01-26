export function AddButton({ addToServer }: { addToServer: () => void })
{
    return (
        <>
            <form action="" onSubmit={async (evt) =>
            {
                evt.preventDefault();
                try
                {
                    await addToServer();
                }
                catch (e)
                {
                    console.log("Couldn't add.")
                }
            }}>
                <button style={{ backgroundColor: "lightblue" }}>
                    Delete!
                </button>
            </form>
        </>
    )
}