export function DeleteButton({ deleteFromServer, deleteFromClient }: { deleteFromServer: () => void, deleteFromClient: () => void })
{
    return (
        <>
            <form action="" onSubmit={async (evt) =>
            {
                evt.preventDefault();
                try
                {
                    await deleteFromServer();
                    deleteFromClient();
                }
                catch (e)
                {
                    console.log("Couldn't delete.")
                }
            }}>
                <button style={{ backgroundColor: "lightblue" }}>
                    Delete!
                </button>
            </form>
        </>
    )
}